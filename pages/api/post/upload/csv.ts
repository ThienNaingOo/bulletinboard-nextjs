import connectMongo from '../../../../utils/dbConnect'
import { IncomingForm } from 'formidable'
import { promises as fs } from 'fs'
import * as Papa from 'papaparse';
import Post from 'models/post.model';

export const config = {
    api: {
        bodyParser: false
    }
};

// const saveFile = async (file) => {
//     fs.readFile(file.filepath + "", 'utf8').then((data) => {
//         Papa.parse(data, {
//             step: function (row) {
//                 console.log("Row:", row.data);
//             }
//         });
//     }).catch((error) => console.log(error)
//     )
// };


export default async function handler(req, res) {

    if (req.method === 'POST') {
        try {
            var counter = 0
            await connectMongo();
            const form = new IncomingForm();
            await form.parse(req, async function (err, fields, files) {
                // const csv = await saveFile(files.file);
                await fs.readFile(files?.file?.filepath + "", 'utf8').then((data) => {
                    
                    Papa.parse(data, {
                        step: function (row) {
                            console.log("Row:", row.data);
                            if (row.data[0] !== 'title' && row.data[0] !== '') {
                                let data = {
                                    title: row.data[0],
                                    description: row.data[1],
                                    created_user_id: fields.user_id,
                                }
                                Post.create(data)                                
                                counter++;
                            }
                        }
                    });
                }).catch((error) => console.log(error)
                )
                res.status(200).json({ success: true, message: 'Added '+ counter + ' rows!'})
            });

        } catch (error) {
            res.json({ error })
        }
    } else {
        res.status(422).send('req_method_not_supported');
    }
}