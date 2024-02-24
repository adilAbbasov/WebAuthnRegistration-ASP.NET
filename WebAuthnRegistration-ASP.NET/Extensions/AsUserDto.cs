using AuthenticationWithWebAuthn.Entities;
using WebAuthnRegistration_ASP.NET.Dtos;

namespace WebAuthnRegistration_ASP.NET.Extensions
{
    public static class AsUserDto
    {
        public static UserDto AsDto(this User user)
        {
            var userDto = new UserDto
            {
                Id = user.Id,
                Email = user.Email,
                UserName = user.UserName
            };

            return userDto;
        }
    }
}
