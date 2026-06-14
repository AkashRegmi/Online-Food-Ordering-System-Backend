import fs from "node:fs";
export const deleteFile = async (filePath) => {
  try {
    await fs.unlink(filePath);
    console.log('file deleted Successfully')
  } catch (error) {
    console.log("Error deleting the file ", error);
  }
};
const files = [
  {
    fieldname: "images",
    originalname: "pizza.jpg",
    encoding: "7bit",
    mimetype: "image/jpeg",
    destination: "uploads/",
    filename: "17123456789-pizza.jpg",
    path: "uploads/17123456789-pizza.jpg",
    size: 123456,
  },
  {
    fieldname: "images",
    originalname: "burger.jpg",
    encoding: "7bit",
    mimetype: "image/jpeg",
    destination: "uploads/",
    filename: "17123456790-burger.jpg",
    path: "uploads/17123456790-burger.jpg",
    size: 98765,
  },
];

export const deleteFiles =async(files)=>{
    try {
        if(!Array.isArray(files)){
            throw new Error("provide the rray of files ")
        }
        files.map((file)=>{
           return fs.unlink(file.path) 
        })

        
    } catch (error) {
        console.log("error deleting the file ")
    }
}