require('dotenv').config();
const  Clarifai = require('clarifai');

const app = new Clarifai.App({
    apiKey: 'a635843830a040acac5abaac256e041c'
   });

const handleApiCall = (req, res) => {
    app.models
        .predict(
        {
          id: 'face-detection',
          name: 'face-detection',
          version: '6dc7e46bc9124c5c8824be4822abe105',
          type: 'visual-detector'
        }, req.body.input)
            .then(data => {
                res.json(data);
            })
            .catch(err => res.status(400).json('API unavailable'))
   }

// const app = new Clarifai.App({
//     apiKey:process.env.CLARIFY_API_KEY
// });

// const handleApiCall = (req, res)=> {
//     app.models
//     .predict('f76196b43bbd45c99b4f3cd8e8b40a8a', req.body.input)
//     .then(data => {
        
//         res.json(data);
//     })
//     .catch(err => res.status(400).json('API error'))
// }


const handleImage = (db) => (req, res) =>{
    const { id }= req.body;
    db('users').where('id', '=', id)
    .increment('entries',1)
    .returning('entries')
    .then(entries => {
        res.json(entries[0].entries);
    })
    .catch(err => res.status(400).json('unable to count'))

}

module.exports ={
    handleImage,
    handleApiCall
}