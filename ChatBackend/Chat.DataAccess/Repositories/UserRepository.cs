using Chat.Core.Models;
using Chat.DataAccess.Entities;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Chat.DataAccess.Repositories
{
    public class UserRepository : IUserRepository
    {
        private readonly ChatDbContext _context;
        public UserRepository(ChatDbContext context)
        {
            _context = context;
        }

        public async Task<List<User>> Get()
        {
            var userEntities = await _context.Users
                .AsNoTracking()
                .ToListAsync();

            var users = userEntities
                .Select(x => User.Create(x.Id, x.Name, x.SessionId, x.Password, x.Email).User)
                .ToList();
            return users;
        }

        public async Task<Guid> Create(User user)
        {
            var userEntity = new UserEntity
            {
                Id = user.Id,
                Name = user.Name,
                SessionId = user.SessionId,
                Password = user.Password,
                Email = user.Email,
            };
            await _context.AddAsync(userEntity);
            await _context.SaveChangesAsync();

            return userEntity.Id;
        }
        //😂❤️😂😂💕💕🤣🤣
        public async Task<Guid> Update(Guid id, string name, string sessionId, string password, string email)
        {
            await _context.Users
                    .Where(x => x.Id == id)
                    .ExecuteUpdateAsync(s => s
                        .SetProperty(x => x.Name, x => name)
                        .SetProperty(x => x.SessionId, x => sessionId)
                        .SetProperty(x => x.Password, x => password)
                        .SetProperty(x => x.Email, x => email));
            return id;
        }

        public async Task<Guid> Delete(Guid id)
        {
            await _context.Users
                .Where(x => x.Id == id)
                .ExecuteDeleteAsync();
            return id;
        }

        public async Task<User> GetByEmail(string email)
        {
            var (user, error) = await _context.Users
                .AsNoTracking()
                .Where(x => x.Email == email)
                .Select(x => User.Create(x.Id, x.Name, x.SessionId, "0", x.Email))
                .FirstOrDefaultAsync();

            return user;
        }

        public async Task<User> GetPasswordByEmail(string email)
        {
            var (user, error) = await _context.Users
                .AsNoTracking()
                .Where(x => x.Email == email)
                .Select(x => User.Create(x.Id, x.Name, x.SessionId, x.Password, x.Email))
                .FirstOrDefaultAsync();

            return user;
        }

        //public async Task<User> GetById(Guid userId)
        //{
        //    var (user, error) = await _context.Users
        //        .AsNoTracking()
        //        .Where(x => x.Id == userId)
        //        .Select(x => User.Create(x.Id, x.Name, x.SessionId, x.Password, x.Email))
        //        .FirstOrDefaultAsync();

        //    return user;
        //}

    }
}
