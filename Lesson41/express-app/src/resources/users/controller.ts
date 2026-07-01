import { Request, Response, NextFunction } from 'express'

const getAll = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // use dummy data for now
    const users = ['John Doe', 'Jane Doe', 'John Smith', 'Jane Smith']
    res.status(200).json(users)
  } catch (error) {
    next(error)
  }
}

const createUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name } = req.body
    res.status(201).json({name: name.toUpperCase()})
  } catch (error) {
    next(error)
  }
}

export default {
  getAll,
  createUser
}
