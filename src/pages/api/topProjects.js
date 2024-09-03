// import axios from '../../req/axios-url';
import axios from 'axios'

// import { NextApiRequest, NextApiResponse } from 'next';
export default  async function handler (req , res) {

    try {
      // let qs = `?start=1&limit=5000&convert=USD`
      const response = await axios.get('https://api.dexview.com/pinksale/top-projects');
      const data = response.data
      res.status(200).json(data)
    } catch (ex) {
      console.log(ex);
      // reject(ex);
      res.status(500).json({message: `Error Fetching from api: ${ex}`})

    }

}