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
    public class FriendRepository : IFriendRepository
    {
        private readonly ChatDbContext _context;
        public FriendRepository(ChatDbContext context)
        {
            _context = context;
        }

        public async Task<List<FriendPair>> Get()
        {
            var friendsPairEntity = await _context.Friends
                .AsNoTracking()
                .ToListAsync();

            var pair = friendsPairEntity
                .Select(x => FriendPair.Create(x.IdPair, x.IdUser, x.IdFriend))
                .ToList();
            return pair;
        }

        public async Task<Guid> Create(FriendPair pair)
        {
            var friendsPairEntity = new FriendPairEntity
            {
                IdPair = pair.Id,
                IdUser = pair.UserId,
                IdFriend = pair.FriendId,
            };
            await _context.AddAsync(friendsPairEntity);
            await _context.SaveChangesAsync();

            return friendsPairEntity.IdPair;
        }
        //🤯🤯🤯🥴🥴
        public async Task<Guid> Update(Guid id, Guid idUser, Guid idFriend)
        {
            await _context.Friends
                    .Where(x => x.IdPair == id)
                    .ExecuteUpdateAsync(s => s
                        .SetProperty(x => x.IdFriend, x => idFriend)
                        .SetProperty(x => x.IdUser, x => idUser));
            return id;
        }

        public async Task<Guid> Delete(Guid id)
        {
            await _context.Friends
                .Where(x => x.IdPair == id)
                .ExecuteDeleteAsync();
            return id;
        }

        public async Task<FriendPair> GetById(Guid id)
        {
            var pair = await _context.Friends
                .AsNoTracking()
                .Where(x => x.IdPair == id)
                .Select(x => FriendPair.Create(x.IdPair, x.IdUser, x.IdFriend))
                .FirstOrDefaultAsync();

            return pair;
        }
    }
}
