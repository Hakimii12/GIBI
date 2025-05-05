import { Query, Document } from "mongoose";
const APIFeatures = class {
    constructor(query, queryStr) {
      this.query = query;
      this.queryStr = queryStr;
    }
    filter() {
      const queryObj = { ...this.queryStr };
      const excludeFields = ["page", "sort", "limit", "fields", "search", "searchFields"];
      excludeFields.forEach((el) => delete queryObj[el]);
      const multiPathFields = {
        school: ["school", "target.school"],
        department: ["department", "target.department"],
        batch: ["batch", "target.batch"],
        section: ["target.section"], 
        year:["year"],
        title: ["title"],
        name:["name"],
        email:["email"],
        batch:["batch"],
        occupation:["occupation"],
      };
  

      const finalFilter = {};

      Object.keys(queryObj).forEach((key) => {
        if (multiPathFields[key]) {
          // For fields with multiple paths, create an $or condition
          const orConditions = multiPathFields[key].map((path) => ({
            [path]: queryObj[key],
          }));
          finalFilter.$or = orConditions;
        } else {
          // For other fields, add directly
          finalFilter[key] = queryObj[key];
        }
      });
  
      let queryStr = JSON.stringify(finalFilter);
      queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);
  
      // Apply the filter to the query
      this.query = this.query.find(JSON.parse(queryStr));
      return this;
    }
  
  
    sort() {
      if (this.queryStr.sort) {
        const sortBy = this.queryStr.sort.split(",").join(" ");
        this.query = this.query.sort(sortBy);
      } else {
        this.query = this.query.sort("-createdAt");
      }
      return this;
    }
  
    limitField() {
      if (this.queryStr.fields) {
        const fields = this.queryStr.fields.split(",").join(" ");
        this.query = this.query.select(fields);
      } else {
        this.query = this.query.select("-__v");
      }
      return this;
    }
  
    paginate() {
        const page = Math.max(1, parseInt(this.queryStr.page, 10) || 1);
        const limit = Math.min(100, Math.max(1, parseInt(this.queryStr.limit, 10) || 10));
        
        const skip = (page - 1) * limit;
        this.query = this.query.skip(skip).limit(limit);
        return this;
      }
  
      search(customSearchFields) {
        if (this.queryStr.search) {
          const searchValue = this.queryStr.search;
          const searchFields = customSearchFields || 
            (this.queryStr.searchFields 
              ? this.queryStr.searchFields.split(",") 
              : ["name", "title", "description"]); 
      
              const searchQuery = {
                $or: searchFields.map((field) => {
                  const regex = field === "target.batch" 
                    ? `^${searchValue}$` 
                    : searchValue;
                  return { [field]: { $regex: regex, $options: "i" } };
                }),
              };
          const currentFilter = this.query.getFilter();
          this.query = this.query.find({
            $and: [currentFilter, searchQuery],
          });
        }
        return this;
      }
  };
  export default APIFeatures