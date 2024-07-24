const {VertexAI} = require('@google-cloud/vertexai');
const {getDataFromGooglePlaces} = require("./PlacesApi");

const vertex_ai = new VertexAI({project: 'genaibuilders24ber2-2912', location: 'us-central1'});
const model = 'gemini-1.5-pro-001';
const modela = 'text-bison';

async function generateContent(expTitle, placeId, language = 'english') {

    const instructionsToTheEditor = {
        text: `You are a copywriter that writes descriptions for leisure experiences. Experiences can be guided tours, boat rentals, leisure parks, etc.
               When you are given the name of the experience and photos about it, you will generate text that: has an high SEO score, makes the reader wants to buy a ticket.
               Implement POSTIVE AND RELATED parts to the experienceTitle the ratings reviews
               DO NOT gather comments of similar experiences.
               If the experience name does not describe the experience but rather the duration or mentions tickets in any way, do not use the experience name for generating the description.
               If you don't understand which specific experience you are prompted, say "I DO NOT UNDERSTAND" and do not generate the content
               DO NOT reference or quote a review
               DO NOT HIGHLIGHT THE RESPONSE OR USE BULLET POINTS
               DO NOT MENTION NAMES OF PERSONS`
    };

    const generativeModel = vertex_ai.preview.getGenerativeModel({
        model: model,
        generationConfig: {
            'maxOutputTokens': 8192,
            'temperature': 1,
            'topP': 0.95,
        },
        safetySettings: [
            {
                'category': 'HARM_CATEGORY_HATE_SPEECH',
                'threshold': 'BLOCK_MEDIUM_AND_ABOVE'
            },
            {
                'category': 'HARM_CATEGORY_DANGEROUS_CONTENT',
                'threshold': 'BLOCK_MEDIUM_AND_ABOVE'
            },
            {
                'category': 'HARM_CATEGORY_SEXUALLY_EXPLICIT',
                'threshold': 'BLOCK_MEDIUM_AND_ABOVE'
            },
            {
                'category': 'HARM_CATEGORY_HARASSMENT',
                'threshold': 'BLOCK_MEDIUM_AND_ABOVE'
            }
        ],
        systemInstruction: {
            parts: [instructionsToTheEditor]
        },
    });
    const {photos, reviews} = await getDataFromGooglePlaces(placeId);

    const req = {
        contents: [
            {
                role: 'user',
                parts: [
                    {
                        text: `Generate a long description for experienceTitle ${expTitle} with ratings: ${reviews} and generate 3 highlights, max 4 words. Separate them with "--". Write it in ${language}`
                    },
                    ...photos
                ]
            }
        ],
    };
    const streamingResp =
        await generativeModel
            .generateContentStream(req);
    const { candidates} = await streamingResp.response;
    return candidates[0]
        .content
        .parts[0]
        .text;
}

module.exports = {
    generateContent
}

