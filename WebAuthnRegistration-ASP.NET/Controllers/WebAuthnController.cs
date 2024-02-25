using AuthenticationWithWebAuthn.Data;
using AuthenticationWithWebAuthn.Dtos;
using AuthenticationWithWebAuthn.Entities;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Mvc;
using WebAuthnRegistration_ASP.NET.Dtos;
using WebAuthnRegistration_ASP.NET.Extensions;

namespace AuthenticationWithWebAuthn.Controllers
{
    [ApiController]
    [Route("controller")]
    [EnableCors("CustomPolicy")]
    public class WebAuthnController(DataContext dataContext) : ControllerBase
    {
        private readonly DataContext _dataContext = dataContext;

        [HttpGet("users")]
        public IEnumerable<UserDto> GetUsers()
        {
            return _dataContext.Users.Select(u => u.AsDto()).ToList();
        }

        [HttpGet("fingerprints")]
        public IEnumerable<FingerprintDto> GetFingerprints()
        {
            return _dataContext.Fingerprints.Select(fp => fp.AsDto()).ToList();
        }

        [HttpPost("users/{userName}")]
        public IActionResult ConfirmUserName(string userName)
        {
            var user = _dataContext.Users.FirstOrDefault(u => u.UserName == userName);

            if (user is null)
                return NotFound();

            var fingerprintKey = _dataContext.Fingerprints.Single(fp => fp.UserId == user.Id).Key;

            return Ok(fingerprintKey);
        }

        [HttpDelete("users/{id}")]
        public IActionResult DeleteUser(int id)
        {
            var user = _dataContext.Users.FirstOrDefault(u => u.Id == id);

            if (user == null)
                NotFound();

            _dataContext.Users.Remove(user!);
            _dataContext.SaveChanges();

            return NoContent();
        }

        [HttpDelete("fingerprints/{id}")]
        public IActionResult DeleteFingerprint(int id)
        {
            var fingerprint = _dataContext.Fingerprints.FirstOrDefault(fp => fp.Id == id);

            if (fingerprint == null)
                NotFound();

            _dataContext.Fingerprints.Remove(fingerprint!);
            _dataContext.SaveChanges();

            return NoContent();
        }

        [HttpPost("signup")]
        public IActionResult Signup(UserSignupDto signupDto)
        {
            if (!ModelState.IsValid)
                return BadRequest(signupDto);

            var user = new User
            {
                UserName = signupDto.UserName,
                Email = signupDto.Email,
            };

            _dataContext.Users.Add(user);
            _dataContext.SaveChanges();

            var fingerprint = new Fingerprint
            {
                Key = signupDto.FingerprintKey,
                UserId = user.Id
            };

            _dataContext.Fingerprints.Add(fingerprint);
            _dataContext.SaveChanges();

            return Ok(signupDto);
        }

        [HttpPost("login")]
        public IActionResult Login(UserLoginDto loginDto)
        {
            var user = _dataContext.Users.FirstOrDefault(u => u.UserName == loginDto.UserName);

            if (user is null)
                return NotFound();

            var fingerprintKey = _dataContext.Fingerprints.Single(f => f.UserId == user.Id).Key;
            var isValid = fingerprintKey == loginDto.FingerprintKey;

            if (!isValid)
                return Unauthorized();

            return Ok(loginDto);
        }
    }
}