//Name: Xuesong Zhou
//ID:127245223 
//Mail:Xzhou145@myseneca.ca

//2) Create another file which uses module from npm library 
const axios = require('axios');

axios.get('https://www.google.ca')
  .then(response => {
    console.log(response.data);
  })
  .catch(error => {
    console.log(error);
  });
