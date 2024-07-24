const {Client} = require("@googlemaps/google-maps-services-js");
const {API_TOKEN} = require("./soSecret");
const client = new Client({});
const getDataFromGooglePlaces = async (placeId) => {
   const r =  await client.placeDetails({
            params: {
                place_id: placeId,
                key: API_TOKEN,
                fields: ['reviews','photos']
            },
            timeout: 10000, // milliseconds
        });
    if(r.data.result.reviews.length === 0) {
        console.log("No reviews found");

    }
    const photosReferences = r.data.result.photos.map((photo) => photo.photo_reference);
    // console.log("Photos: ", photosReferences.map((photo) => `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photo_reference=${photo}&key=${API_TOKEN}`));

    const photosRes = await Promise.all(photosReferences.map((reference) => getPhoto(reference)));
    const photos = photosRes.map((photo) => ({
            inlineData: {
                mimeType: 'image/jpeg',
                data: photo.data.toString('base64')
        }}
        ));
    const reviews = r.data.result.reviews.filter((review) => review.rating > 4).map((review) => review.text);
    return {
        reviews,
        photos
    }

}

const getPhoto = async (id) => {
    return client.placePhoto({
        params: {
            photoreference: id,
            key: API_TOKEN,
            maxheight: 200,
            maxwidth: 200,
        }
    });
}


module.exports = {
    getDataFromGooglePlaces
}
