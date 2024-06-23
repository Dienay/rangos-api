import { NextFunctionProps, RequestProps, ResponseProps } from '@/config';
import { User, Establishment } from '@/models';
import { IAddress } from '@/models/Address';

class AddressController {
  static addAddress = async (req: RequestProps, res: ResponseProps, next: NextFunctionProps) => {
    try {
      const { entityId } = req.params;
      const address = req.body as IAddress;

      const entity = (await User.findById(entityId)) || (await Establishment.findById(entityId));

      if (!entity) {
        return res.status(404).json({
          message: 'Entity not found.'
        });
      }

      const addressExists = entity.address.some(
        (currentAddress: IAddress) =>
          currentAddress.street === address.street &&
          currentAddress.number === address.number &&
          currentAddress.city === address.city &&
          currentAddress.state === address.state
      );

      if (addressExists) {
        return res.status(409).json({
          message: 'Address already exists.'
        });
      }

      const model = entity instanceof User ? User : Establishment;

      const updateEntityAddress =
        (await (model as typeof User).findByIdAndUpdate(
          entityId,
          { $push: { address } },
          { new: true, runValidators: true }
        )) ||
        (await (model as typeof Establishment).findByIdAndUpdate(
          entityId,
          { $push: { address } },
          { new: true, runValidators: true }
        ));

      if (!updateEntityAddress) {
        return res.status(500).json({
          message: 'Erro ao atualizar o endereço.'
        });
      }

      return res.status(200).json({
        message: 'Address added successfully',
        address: updateEntityAddress?.address
      });
    } catch (error) {
      return next(error);
    }
  };

  static getAddress = async (req: RequestProps, res: ResponseProps, next: NextFunctionProps) => {
    try {
      const { entityId } = req.params;

      const entity = (await User.findById(entityId)) || (await Establishment.findById(entityId));

      if (!entity) {
        return res.status(404).json({
          message: 'Entity not found.'
        });
      }

      return res.status(200).json({
        address: entity.address
      });
    } catch (error) {
      return next(error);
    }
  };

  static editAddress = async (req: RequestProps, res: ResponseProps, next: NextFunctionProps) => {
    try {
      const { entityId, addressId } = req.params;
      const updateData = req.body as Partial<IAddress>;

      const entity = (await User.findById(entityId)) || (await Establishment.findById(entityId));

      if (!entity) {
        return res.status(404).json({
          message: 'Entity not found.'
        });
      }

      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      const address = entity.address.find((addr: IAddress) => addr.id.toString() === addressId);

      if (!address) {
        return res.status(404).json({
          message: 'Address not found.'
        });
      }

      Object.assign(address, updateData);

      await entity.save();
      return res.status(200).json({
        message: 'Address updated successfully',
        address
      });
    } catch (error) {
      return next(error);
    }
  };

  static deleteAddress = async (req: RequestProps, res: ResponseProps, next: NextFunctionProps) => {
    try {
      const { entityId, addressId } = req.params;

      const entity = (await User.findById(entityId)) || (await Establishment.findById(entityId));

      if (!entity) {
        return res.status(404).json({
          message: 'Entity not found.'
        });
      }

      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      const address = entity.address.findIndex((addr: IAddress) => addr.id.toString() === addressId);

      if (address === -1) {
        return res.status(404).json({
          message: 'Address not found.'
        });
      }

      entity.address.splice(address, 1);
      await entity.save();

      return res.status(200).json({
        message: 'Address deleted successfully'
      });
    } catch (error) {
      return next(error);
    }
  };
}

export default AddressController;
