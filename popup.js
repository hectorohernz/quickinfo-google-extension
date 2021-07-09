// @Description: Checking that html has full loaded
// @Params:
// Returns: Void

document.addEventListener(
  'DOMContentLoaded',
  () => {
    document.getElementById('submitUrl').addEventListener('click', main)
  },
  false,
)

// @Description: Starting point of the application
// @Params:
// Returns: Void
const main = async () => {
  event.preventDefault()
  let urlValue = document.getElementById('urlText').value
  if (checkIsUrlVaild(urlValue)) {
    const htmlResponse = await fetchHtmlFromUrl(urlValue);
    stripContentFromUrl(htmlResponse);
    // Script Url
  } else {
    console.log("ERR: Invaild Url")
    // Pop Up error message
  }
}

// @Description: Url Vaildation to assure it's supported.
// @Params: Product Url from Input
// Returns: Boolean
const checkIsUrlVaild = (URL) => {

  if (URL === null || URL === '') {
    return false
  }

  let parser = document.createElement('a')
  parser.href = URL
  if (
    parser.protocol === 'https:' &&
    parser.hostname === 'weidian.com' &&
    parser.pathname === '/item.html'
  ) {
    return true
    //console.log(parser.protocol, parser.hostname, parser.pathname, parser.search);
  } else {
    //console.log("NOT WEIDIAN")
    //console.log(typeof parser.protocol, parser.hostname, parser.pathname, parser.search);
    return false
  }
}

// Returns: object(html document)
const fetchHtmlFromUrl = async (strUrlValue) => {
  let options = {
    method: 'GET',
    mode: 'no-cors', // no-cors, *cors, same-origin
  }

  let response = await fetch(strUrlValue, options)
    .then((response) => response.text())
    .then((html) => {
      let parser = new DOMParser()
      let doc = parser.parseFromString(html, 'text/html')
      return doc
    })
  return response
}

// @Description: Script to remove nessary infomation from html into object 
// @Params: DOMHTML -> Object
// Returns: Object
const stripContentFromUrl = (htmlContent) => {
  const product = {
    title: "", // String
    price: 0.00, // Double 
    seller : "", // String
    postage: "",  //  String
    shippingLocation: "" // String
  }
  console.log(htmlContent);
  product.price = htmlContent.querySelector("#__rocker-render-inject__").dataset;
  product.title = htmlContent.querySelector(".item-name");
  product.postage = htmlContent.querySelector(".postage-block");
  product.shippingLocation = htmlContent.querySelector(".delivery-address-location");
  product.seller = htmlContent.querySelector(".shop-name-str");

  console.log(product);
}