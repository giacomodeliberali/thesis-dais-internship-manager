import { express } from 'express';

const app = express()

app.get('/', (req: Request, res: Response) => {
  res.send('Hello World')
})

app.listen(3000)