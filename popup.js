// @Description: Checking that html has full loaded
// @Params:
// @Returns: Void
document.addEventListener(
  'DOMContentLoaded',
  () => {
    document.getElementById('submitUrl').addEventListener('click', main)
  },
  false,
)

// @Description: Starting point of the application
// @Params:
// @Returns: Void
const main = async () => {
  event.preventDefault()

  let urlValue = document.getElementById('urlText').value

  if (checkIsUrlVaild(urlValue)) {
    const htmlResponse = await fetchHtmlFromUrl(urlValue)
    let product = stripContentFromUrl(htmlResponse)
    appendProductDataToScreen(product)
  } else {
    console.log('ERR: Invaild Url')
    // Pop Up error message
  }
}

// @Description: Url Vaildation to assure it's supported.
// @Params: Product Url from Input
// @Returns: Boolean
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
  } else {
    return false
  }
}

// @Returns: object(html document)
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
// @Returns: Object
const stripContentFromUrl = (htmlContent) => {
  const product = {
    title: '', // String
    price: 0.0, // Double
    seller: '', // String
    postage: '', //  String
    stock: 0, // String,
    sizes: [] // ARRAY OF AVAIBLE SIZES 
  }
  try {
    let jsonData = JSON.parse(
      htmlContent.querySelector('#__rocker-render-inject__').dataset.obj,
    )
    product.price = jsonData.result.default_model.item_info.origin_price;
    product.title = jsonData.result.default_model.item_info.item_name
    
    if(jsonData.result.default_model.delivery_info.expressFeeDesc == undefined ||  jsonData.result.default_model.delivery_info.expressFeeDesc  === null){
      product.postage = 0;
    } else {
      product.postage = jsonData.result.default_model.delivery_info.expressFeeDesc;
    }

    product.seller = jsonData.result.default_model.shop_info.shopName;
    product.stock = jsonData.result.default_model.item_info.stock;

    return product;
  } catch (error) {
    console.log(error)
  }
}



// @Description: Append Products infomation to screen
// @Params: Product -> Object
// @Returns: VOID
const appendProductDataToScreen = (product) => {
  const listOfIds = ["price", "title","seller" ,"postage", "stock"];
  listOfIds.forEach(member => {
      let currentMember = document.getElementById("pv--"+ member);
      currentMember.innerText = product[member];
      console.log(currentMember)
  })
  let contentContainer = document.getElementById("product-content");
  contentContainer.classList.remove("hidden")

}