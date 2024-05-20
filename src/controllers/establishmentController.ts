import { RequestProps, ResponseProps, NextFunctionProps } from '@/config';
import NotFound from '@/errors/NotFound';
import { IEstablishment } from '@/models/Establishment';
import { Establishment } from '../models/index';

class EstablishmentController {
  static async createEstablishment(this: void, req: RequestProps, res: ResponseProps, next: NextFunctionProps) {
    try {
      const newEstablishment = await Establishment.create(req.body);

      await newEstablishment.save();

      res.status(201).json({
        message: 'Establishment created successfully.',
        data: newEstablishment
      });
    } catch (error) {
      next(error);
    }
  }

  static async getEstablishments(this: void, req: RequestProps, res: ResponseProps, next: NextFunctionProps) {
    try {
      const establishmentList = await Establishment.find({});

      res.status(200).json(establishmentList);
    } catch (error) {
      next(error);
    }
  }

  static async getEstablishmentById(this: void, req: RequestProps, res: ResponseProps, next: NextFunctionProps) {
    try {
      const { id } = req.params;
      const foundEstablishment = await Establishment.findById(id);

      if (foundEstablishment !== null) {
        res.status(200).json(foundEstablishment);
      } else {
        next(new NotFound('Establishment Id not found.'));
      }
    } catch (error) {
      next(error);
    }
  }

  // static async getEstablishmentFilter(req: RequestProps, res: ResponseProps, next: NextFunctionProps) {

  // }

  static async updateEstablishment(
    this: void,
    req: RequestProps,
    res: ResponseProps,
    next: NextFunctionProps
  ): Promise<void> {
    try {
      const { id } = req.params;
      const newData = req.body as Partial<IEstablishment>;

      const validationError = new Establishment(newData).validateSync();
      if (validationError) {
        return next(validationError);
      }

      const foundIdEstablishment = await Establishment.findByIdAndUpdate(id, { $set: newData }, { new: true });

      if (foundIdEstablishment !== null) {
        res.status(200).send({
          message: 'Establishment updated successfully',
          data: newData
        });
      } else {
        throw new NotFound('Establishment Id not found.');
      }
    } catch (error) {
      return next(error);
    }

    return undefined;
  }

  static async deleteEstablishment(this: void, req: RequestProps, res: ResponseProps, next: NextFunctionProps) {
    try {
      const { id } = req.params;
      const deletedEstablishment = await Establishment.findByIdAndDelete(id);

      if (deletedEstablishment !== null) {
        res.status(200).json({
          message: 'Establishment deleted successfully',
          data: deletedEstablishment
        });
      } else {
        next(new NotFound('Establishment Id not found.'));
      }
    } catch (error) {
      next(error);
    }
  }
}

export default EstablishmentController;
