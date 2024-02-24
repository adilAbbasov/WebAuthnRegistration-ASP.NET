using AuthenticationWithWebAuthn.Entities;
using WebAuthnRegistration_ASP.NET.Dtos;

namespace WebAuthnRegistration_ASP.NET.Extensions
{
    public static class AsFingerprintDto
    {
        public static FingerprintDto AsDto(this Fingerprint fingerprint)
        {
            var fingerprintDto = new FingerprintDto
            {
                Id = fingerprint.Id,
                UserId = fingerprint.UserId,
                Key = fingerprint.Key
            };

            return fingerprintDto;
        }
    }
}
