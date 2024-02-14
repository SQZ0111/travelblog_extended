//DATA FILTERING
const hotelForm = document.getElementById("hotelSearchForm");

function getFormFields() {
    const location = document.getElementById('location').value;
    const priceFrom = document.getElementById('priceFrom').value;
    const priceTo = document.getElementById('priceTo').value;
    const dateCheckIn = document.getElementById('checkinDate').value;
    const dateCheckOut = document.getElementById('checkoutDate').value;
    const adultsPersons = document.getElementById('adults').value;
    console.log(location);
    return [location,priceFrom,priceTo,dateCheckIn,dateCheckOut,adultsPersons]
}

function convertToRequestData() {
    const formObject = getFormFields();

    return {
        location: formObject[0],
        price: {
            from: formObject[1],
            to: formObject[2],
        },
        date: {
            checkIn: formObject[3],
            checkOut: formObject[4],
        },
        adults: formObject[5]
    };
}

function setUrlForRequstRegionSearch(requestData) {
    const url = `https://hotels-com-provider.p.rapidapi.com/v2/regions?query=${requestData.location}&domain=DE&locale=de_DE`
    return url;
}

function setOptionsForRequest() {
    const options = {
        method: 'GET',
        headers: {
            'X-RapidAPI-Key': '8cac37d31dmsh9aa21fcabf43c96p182740jsn56566115c49b',
            'X-RapidAPI-Host': 'hotels-com-provider.p.rapidapi.com'
        }
    };
    return options;
}



async function sendRequestRegionSearchApi(requestData) {
    const url = setUrlForRequstRegionSearch(requestData)
    const options = setOptionsForRequest();
    try {
        const response = await fetch(url, options);
        const result = await response.text();
        return result;
    } catch (error) {
        console.error(error);
    }
}

function parseJsonObject(responseObject) {
    responseObject = JSON.parse(responseObject);
    return responseObject;
}

function getGaiaIdFromRegions(regionObject) {
    const gaidIds = regionObject.data
        .filter(element => element.gaiaId !== undefined)
        .map(element => element.gaiaId)
    return gaidIds;
}

function setUrlForRequstHotelSearch(requestData,gaiaId) {
    const url = `https://hotels-com-provider.p.rapidapi.com/v2/hotels/search?region_id=${gaiaId}&locale=de_DE&checkin_date=${requestData.date.checkIn}&sort_order=REVIEW&adults_number=${requestData.adults}&domain=DE&checkout_date=${requestData.date.checkOut}&children_ages=4%2C0%2C15&lodging_type=HOTEL%2CHOSTEL%2CAPART_HOTEL&price_min=${requestData.price.from}&star_rating_ids=3%2C4%2C5&meal_plan=FREE_BREAKFAST&page_number=1&price_max=${requestData.price.to}&amenities=WIFI%2CPARKING&payment_type=PAY_LATER%2CFREE_CANCELLATION&guest_rating_min=8&available_filter=SHOW_AVAILABLE_ONLY`
    return url;
}

async function sendRequestHotelSearchApi(requestData) {
    const url = setUrlForRequstHotelSearch(requestData,1427)
    const options = setOptionsForRequest();
    try {
        const response = await fetch(url, options);
        let result = await response.text();
        result = parseJsonObject(result);
        return result.properties;
    } catch (error) {
        console.error(error);
    }
}

function createFilteredHotelDetails(element) {
    return {
        hotelname: element.name,
        price: element.price.lead.formatted,
        location: element.neighborhood.name,
        imageUrl: element.propertyImage.image.url,
    }
}

function checkOnKeysIncludedInHotelObject(element) {
       return element &&
        element.name &&
        element.price?.lead?.formatted &&
        element.neighborhood?.name &&
        element.propertyImage?.image?.url;
}

function filterHotelReponseObjects(hotelResponseObject) {
    let filteredHotels = hotelResponseObject.filter((hotel) => {
        return checkOnKeysIncludedInHotelObject(hotel);
    });

    console.log("Filtered (Post-Filter):", filteredHotels);

    filteredHotels = filteredHotels.map((hotel) => {
       return createFilteredHotelDetails(hotel);
    });

    console.log("Filtered Hotels (Post-Map):", filteredHotels);
    
    return filteredHotels;
    
}
//DOM

function getSearchResultsParent() {
    const searchResultsParent = document.querySelector(".content");
    return searchResultsParent;
}

function createSearchResultsContainer() {
    const divContainer = document.createElement("div");
    divContainer.setAttribute("id","searchResults");
    return divContainer;
}

function createHotelNodesContainer() {
    const hotelNodeContainer = document.createElement("div");
    hotelNodeContainer.setAttribute("class","hotel");
    return hotelNodeContainer;
}
function createHotelImgElement(hotelImgUrl) {
    const hotelImg = document.createElement("img");
    hotelImg.setAttribute("src",hotelImgUrl);
    hotelImg.setAttribute("class","hotel-img")
    hotelImg.setAttribute("alt","Hotel Picture");
    return hotelImg;
}

function createHotelName(hotelName) {
    const hotelHeader = document.createElement("h4");
    hotelHeader.innerText = hotelName;
    return hotelHeader;
} 

function createHotelInformation(hotelLocation,hotelPrice) {
    const listContainer = document.createElement("ul");
    const hotelLocationItem = document.createElement("li");
    const hotelPriceItem = document.createElement("li");
    hotelLocationItem.innerText = hotelLocation != "" ? hotelLocation : "not found";
    hotelPriceItem.innerText = hotelPrice != "" ? `${hotelPrice}` : "not found";
    listContainer.append(hotelLocationItem,hotelPriceItem); 
    console.log(listContainer);
    return listContainer;
}
function createSearchResultsNodes(hotelInformationObject) {
    const hotelImgNode = createHotelImgElement(hotelInformationObject.imageUrl);
    const hotelNameNode= createHotelName(hotelInformationObject.hotelname);
    const hotelInfoNode = createHotelInformation(hotelInformationObject.location,hotelInformationObject.price);
    console.log(hotelInfoNode);
    return [hotelImgNode,hotelNameNode,hotelInfoNode];
}

function appendNodesToHotelNodesContainer(hotelNodes) {
    const hotelNodeContainer = createHotelNodesContainer();
    hotelNodeContainer.append(hotelNodes[0],hotelNodes[1],hotelNodes[2]);
    return hotelNodeContainer;
}

function appendNodesContainerToSearchResultsContainer(searchResultsContainer,hotelNodesContainer) {
    searchResultsContainer.append(hotelNodesContainer);
}   

function createSearchResultsContainerElement(hotelInformation){
    const hotelSearchResultsElement = createSearchResultsContainer();
    console.log(hotelSearchResultsElement);
    hotelInformation.forEach((hotel) => {
        console.log(hotel);
        const hotelNodes = createSearchResultsNodes(hotel);
        console.log(hotelNodes);
        const hotelNodeContainer = appendNodesToHotelNodesContainer(hotelNodes);
        console.log(hotelNodeContainer);
        appendNodesContainerToSearchResultsContainer(hotelSearchResultsElement,hotelNodeContainer);
    })

    return hotelSearchResultsElement;
}

function getAppContentElement() {
    return document.querySelector(".content")
}
function appendSearchResultsContainerOnAppContent(searchResultsElement) {
    const appContentElement = getAppContentElement();
    appContentElement.append(searchResultsElement);
}


hotelForm.addEventListener("submit",async(e) => {
    e.preventDefault();
    //DATA FILTER FUNCTION CALLS
    const requestData = convertToRequestData();
    console.log(requestData);
    let foundRegions = await sendRequestRegionSearchApi(requestData);
    foundRegions = parseJsonObject(foundRegions);
    const gaidIds = getGaiaIdFromRegions(foundRegions);
    const hotelResponse = await sendRequestHotelSearchApi(requestData);
    const hotelsInformation = filterHotelReponseObjects(hotelResponse);

    const searchResultElement = createSearchResultsContainerElement(hotelsInformation);
    console.log(searchResultElement);
    appendSearchResultsContainerOnAppContent(searchResultElement);
})