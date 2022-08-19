import { IncomingForm } from 'formidable'
import { promises as fs } from 'fs'
import path from 'path';

export const config = {
    api: {
        bodyParser: false
    }
};

const saveFile = async (file) => {
    const data = await fs.readFile(file.filepath + "");
    fs.writeFile(`./public/.temp/${file.originalFilename}`, data);
    await fs.unlink(file.filepath);
    return { path: "/.temp/" + file.originalFilename, name: file.originalFilename };
};

export default async function handler(req, res) {
    if (req.method === 'PUT') {
        try {
            const form = new IncomingForm();
            await form.parse(req, async function (err, fields, files) {
                let ext = path.extname(files.file.originalFilename)                
                if (ext === '.jpg' || ext === '.png') {
                    const file = await saveFile(files.file);
                    res.status(200).json({ success: true, message: 'Your action is Successed.', data: file })
                } else res.status(422).json({ success: false, message: 'Invalid file type' })
            })
        } catch (error) {
            res.json({ error })
        } 
    } else res.status(405).json({ success: false, message: 'Request Method is not allowed.' })
}