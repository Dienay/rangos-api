import { Request, Response } from "express";
import { establishment } from "../models/index";

class EstablishmentController {
  static async createEstablishment(req: Request, res: Response) {
    try {
      const newEstablishment = await establishment.create(req.body);

      await newEstablishment.save();

      res.status(201).json({
        message: "Establishment created successfully.",
        data: newEstablishment
      });
    } catch (error) {
      res.status(500).json({
        message: `${(error as Error).message} - Establishment created failed.`
      })
    }
  }

  static async getEstablishments(req: Request, res: Response) {
    try {
      const establishmentList = await establishment.find({});

      res.status(200).json(establishmentList);
    } catch (error) {
      res.status(500).json({
        message: `${(error as Error).message} - Request failed.`
      })
    }
  }

  static async getEstablishmentById(req: Request, res: Response) {
    try {
      const id = req.params.id;
      const foundEstablishment = await establishment.findById(id);

      res.status(200).json(foundEstablishment);
    } catch (error) {
      res.status(404).json({
        message: `${(error as Error).message} - Establishment not found.`
      })
    }
  }

  static async updateEstablishment(req: Request, res: Response) {
    try {
      const id = req.params.id;
      await establishment.findByIdAndUpdate(id, req.body);

      res.status(200).json({
        message: 'Establishment updated successfully',
        data: req.body
      })
    } catch (error) {
      res.status(404).json({
        message: `${(error as Error).message} - Not possible update Establishment.`
      })
    }
  }

  static async deleteEstablishment(req: Request, res: Response) {
    try {
      const id = req.params.id;
      const deletedEstablishment = await establishment.findByIdAndDelete(id);

      res.status(200).json({
        message: 'Establishment deleted successfully',
        data: deletedEstablishment
      })
    } catch (error) {
      res.status(404).json({
        message: `${(error as Error).message} - Not possible delete Establishment.`
      })
    }
  }
}

export default EstablishmentController;