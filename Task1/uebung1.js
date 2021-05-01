/**
 * just for better overview
 * @author @OTI2020 Gustav
 * @function main
 */
 function main() {
    console.log("test main my paraklet")

    makeSeperationArray(route, polygon)
    sectionCount(seperationArray)
}


/**
 * only for testing if lat and lon are swapped
 * function swapped lat and lon
 * @function changeLatLon
 * @param {Array} point
 * @returns {Array}
 */
function changeLatLon(point) {
    var temp = point[0]
    point[0] = point[1]
    point[1] = temp

    return point
}


/**
 * this calculations base on a sphere as representation of the earth
 * so we have errors up to 0.3%, because the earth is a little elliptic
 * @function calculateDistanceBetweenTwoPoints
 * @param {Array} pointA - two points as arrays
 * @param {Array} pointB
 * each point-coordinates represent one latitude and one longitude
 * @return {float} - returns the distance between pointA and PointB
 * Algorithim like this https://www.movable-type.co.uk/scripts/latlong.html
 */
 function calculateDistanceBetweenTwoPoints(pointA, pointB) {
    const p = Math.PI/180 // PI/180 is ca. 0.017453292519943295
    const R = 6371e3; // R is earth’s radius (mean radius = 6,371 km)
    var c = Math.cos // cosisnus
    var s = Math.sin // sinus
    var at = Math.atan2 // arctan2
    
    var lat1 = pointA[1] // latitude of pointA
    var lon1 = pointA[0] // longitude of pointA
    var lat2 = pointB[1] // latitude of pointB
    var lon2 = pointB[0] // longitude of pointB
    
    // multiplication with p to convert from degree to radian
    // for the use in trigonomic functions
    const phi1 = lat1 * p
    const phi2 = lat2 * p
    const delPhi = (lat2-lat1) * p // delta phi - means difference between both latitudes
    const delLam = (lon2-lon1) * p // delta lambda - means difference between both longitudes
    
    // trigonometic calculations for geodetic purpose
    // base on the haversine formula
    const partA = s(delPhi/2) * s(delPhi/2) + c(phi1) * c(phi2) * s(delLam/2) * s(delLam/2)
    const partB = 2 * at(Math.sqrt(partA), Math.sqrt(1-partA))
    const dist = R * partB // in metres

    // returns distance between the both input points
    return dist
}
// test @function calculateDistanceBetweenTwoPoints
console.log("test calculateDistanceBetweenTwoPoints")
console.log(calculateDistanceBetweenTwoPoints(changeLatLon(polygon[0]), changeLatLon(polygon[1])))
console.log(calculateDistanceBetweenTwoPoints(polygon[0], polygon[1]))


/**
 * 
 * @function detectPointInPolygon
 * @param {Array} point - needs a polygon as an array and the point as an array
 * @param {Array} polygon 
 * @return {boolean} - returns true if the point is inside the polygon or 
 * on the border of the polygon and false if the point is not inside the polygon
 */
function detectPointInPolygon(point, polygon) {
    var x = point[0] //longitude of the point
    var y = point[1] //latitude of the point

    var inside = false //initial value for the check
    for (var i = 0, j = polygon.length - 1; i < polygon.length; j = i++) { //iterate over the polygon 
        var xi = polygon[i][0] //longitude of vertex i
        var yi = polygon[i][1] //latitude of vertex i
        var xj = polygon[j][0] //longitude of vertex j
        var yj = polygon[j][1] //latitude of vertex j
        
        //check if the casted ray intersect relevant segments of the polygon
        var intersect = ((yi > y) != (yj > y)) && (x < (xj - xi) * (y - yi) / (yj - yi) + xi) 
        
        if (intersect) { //if the casted ray intersect a relevant segment the inside value is changend
            inside = !inside 
        } 
    }
    return inside; //return the result (true for odd number of relevat segments intersected and false for an even number of relevant segments intersected)
}
// test @function detectPointInPolygon
console.log("test detectPointInPolygon")
console.log(detectPointInPolygon(route[0], polygon))


/**
 * The function fills an array with boolean values calculatet with 
 * the function detectPointInPolygon.
 * For each point of the in_route, we save the information if it
 * is in- or outsine the in_polygone in the seperationArray.
 * The seperationArray is declaired in the following.
 * @function makeSeperationArray
 * @param {Array} in_route - array of points
 * @param {Array} in_polygon - given polygone
 * @returns {Array} 
 */
function makeSeperationArray(in_route, in_polygone) {
    var separationArray= [route.length]
    for(let i=0; i<separationArray.length-1; i++) {
        seperationArray[i] = detectPointInPolygon(in_route[i], in_polygone)
    }
    return seperationArray
}


/**
 * @function sectionCount
 * @param {Array} in_seperationArray
 */
function sectionCount(in_seperationArray) {
    var sectionCounter = 1
    for(let i=0; i<seperationArray.length-2; i++) {
        if (in_seperationArray[i] != in_seperationArray[i+1]) {
            sectionCounter ++
        }
    }
}