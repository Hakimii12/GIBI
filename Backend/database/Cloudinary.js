/* Updating or adding code to this section is not permitted for any stakeholders
   but if it happen or it have to happen please report about the change to me &
    make sure to add the comment to which part 
you have add or make a change on the top of this comment!!!!!!!!
*/
import {v2 as cloudinary} from 'cloudinary'
import dotenv from 'dotenv'
      dotenv.config()
 cloudinary.config({
    cloud_name:process.env.CLOUD_NAME,
    api_key:process.env.API_KEY,
    api_secret:process.env.API_SECRET
})
export default cloudinary

