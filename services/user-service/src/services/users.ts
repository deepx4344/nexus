import type { UserRegistationInterface } from "@nexus/shared";
import User from "../models/user.model.js";

class UserService {
  create = async (data: UserRegistationInterface): Promise<void> => {
    const exists: boolean = !!(await User.exists({ authId: data.authId }));
    if (exists) return;
    const user = new User({
      authId: data.authId,
      email: data.email,
      profile: {
        firstName: data.firstname,
        lastName: data.lastname,
        phone: data.phone,
        avatarUrl: data.avatarUrl,
      },
      preferences: {
        currency: data.currency,
        language: data.language,
      },
      addresses: [
        {
          label: data.label,
          street: data.street,
          city: data.city,
          state: data.state,
          postalCode: data.postalCode,
          country: data.country,
          isDefault: true,
        },
      ],
    });
    await user.save();
  };
}

const userService = new UserService();
export default userService;
