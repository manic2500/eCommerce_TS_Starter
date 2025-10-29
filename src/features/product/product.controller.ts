import { RequestHandler } from "express";
import { productService } from "./product.service";


export const getLatestProducts: RequestHandler = async (req, res) => {

    const products = await productService.getLatestProducts()

    res.status(200).json(products)
}
export const getAllProducts: RequestHandler = async (req, res) => {

    const products = await productService.getAllProducts()

    res.status(200).json(products)
}