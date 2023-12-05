var qs = require("qs");

class ApiFeatures {
  constructor(query, queryStr) {
    this.query = query;
    this.queryStr = queryStr;
  }
  search(){
      const keyword = this.queryStr.keyword ? {"residence.residence_address": {
          $regex: this.queryStr.keyword,
          $options: 'i'
      }} : {};

      console.log(keyword);
      this.query = this.query.find({ ...keyword });
      return this;
  }


  filter() {

    const queryCopy = {  ...this.queryStr };
    

    let params = new URLSearchParams (queryCopy);
    let keysForDel = [];
    params.forEach((value, k) => {
      console.log("value", value);
      console.log("queryCopy", queryCopy);
      console.log("k", k);


      if (value == '' ) {
        keysForDel.push(k);
      }

      });

    keysForDel.forEach((k) => {
      params.delete(k);
    });

    console.log("============================>", keysForDel);

    const removefield = ["keyword", "page", "limit"];
    for (let i = 0; i < keysForDel.length; i++) {
      removefield.push(keysForDel[i]);
    }
    removefield.forEach((key) => delete queryCopy[key]);

    console.log("query2", removefield)
    let queryStr = JSON.stringify(queryCopy);
    const regex = /\b(gt|gte|lt|lte|in)\b/g;
    const REGEXP = /^$/;

    queryStr = queryStr.replace(regex, (key) => `$${key}`);
    queryStr = queryStr.replace(REGEXP);

    console.log('queryStr3', queryCopy?.type)
    if(queryCopy?.type == "New"){
      this.query = this.query.sort({ createdAt: -1 });
    } else{

      this.query = this.query.find(JSON.parse(queryStr));
    }

    return this;
  }

  pagination(resultPerPage){

      const currentPage = Number(this.queryStr.page) || 1;

      const skip = resultPerPage * (currentPage - 1);

      this.query = this.query.limit(resultPerPage).skip(skip);

      return this;
  }
}

module.exports = ApiFeatures;
