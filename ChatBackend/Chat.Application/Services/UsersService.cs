using Chat.Core.Models;
using Chat.DataAccess.Repositories;
using Chat.Infrastructure;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Chat.Application.Services
{
    public class UsersService : IUsersService
    {
        private readonly IUserRepository _userRepository;
        private readonly IPasswordHasher _passwordHasher;
        private readonly IJwtProvider _jwtProvider;
        public UsersService(IUserRepository userRepository, IPasswordHasher passwordHasher, IJwtProvider jwtProvider)
        {
            _userRepository = userRepository;
            _passwordHasher = passwordHasher;
            _jwtProvider = jwtProvider;
        }

        public async Task<List<User>> GetAllUsers()
        {
            return await _userRepository.Get();
        }

        public async Task<Guid> CreateUser(User user)
        {
            return await _userRepository.Create(user);
        }

        public async Task<Guid> DeleteUser(Guid id)
        {
            return await _userRepository.Delete(id);
        }

        public async Task<User> GetByEmail(string email)
        {
            return await _userRepository.GetByEmail(email);
        }

        public async Task<User> GetPasswordByEmail(string email)
        {
            return await _userRepository.GetPasswordByEmail(email);
        }

        public async Task<Guid> UpdateUser(Guid id, string name, string sessionId, string password, string email)
        {
            return await _userRepository.Update(id, name, sessionId, password, email);
        }

        public async Task Register(string name, string sessionId, string password, string email)
        {
            var hashedPassword = _passwordHasher.Generate(password);

            Console.WriteLine($"password: {password}\nHashed: {hashedPassword}");

            var (user, error) = User.Create(Guid.NewGuid(), name, sessionId, hashedPassword, email);

            await CreateUser(user);
        }

        public async Task<string> Login(string email, string password)
        {
            var user = await _userRepository.GetPasswordByEmail(email);
            if (user == null)
            {
                throw new Exception("No such user");
            }
            Console.WriteLine($"password: {password}\nuser.Password: {user.Password}");
            var result = _passwordHasher.Verify(password, user.Password);
            if (!result)
            {
                throw new Exception($"Failed to login {email}");
            }

            var token = _jwtProvider.GenerateToken(user);
            return token;
        }
    }
}
