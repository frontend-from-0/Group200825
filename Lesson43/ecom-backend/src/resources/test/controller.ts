import { prisma } from '../../common/prisma'
import { Request, Response } from 'express'

async function testOrder(req: Request, res: Response) {
  const request = req.body
  console.log('request', request)

  if (request.description) {
    const testOrder = await prisma.testOrder.create({
      data: {
        description: request.description,
      },
    })

    res.status(200).json({
      order: testOrder,
    })
  } else {
    res.status(400).json({
      error: 'Order description is required and should be a string of 3 chars length minimum.',
    })
  }
}

async function testProduct(req: Request, res: Response) {
  console.log('testing product....')
}

export default { testOrder, testProduct }
