import { Query, Document } from "mongoose";
const APIFeatures = class {
    constructor(query, queryStr) {
      this.query = query;
      this.queryStr = queryStr;
    }
    filter() {
      const queryObj = { ...this.queryStr };
      const excludeFields = [
        "page",
        "sort",
        "limit",
        "fields",
        "searchFields",
      ];
      excludeFields.forEach((el) => delete queryObj[el]);
  
      let queryString = JSON.stringify(queryObj);
      queryString = queryString.replace(
        /\b(gte|gt|lte|lt)\b/g,
        (match) => `$${match}`
      );
  
      this.query = this.query.find(JSON.parse(queryString));
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
            $or: searchFields.map((field) => ({
              [field]: { 
                $regex: `^${searchValue}$`,
                $options: "i" 
              },
            })),
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