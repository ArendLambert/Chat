using Chat.Core.Models;
using Chat.DataAccess.Repositories;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Chat.Application.Services
{
    public class FriendPairService : IFriendPairService
    {
        private readonly IFriendRepository _friendRepository;
        public FriendPairService(IFriendRepository friendRepository)
        {
            _friendRepository = friendRepository;
        }
        public async Task<List<FriendPair>> GetAllPairs()
        {
            return await _friendRepository.Get();
        }

        public async Task<Guid> CreatePair(FriendPair pair)
        {
            return await _friendRepository.Create(pair);
        }

        public async Task<Guid> DeletePair(Guid id)
        {
            return await _friendRepository.Delete(id);
        }

        public async Task<FriendPair> GetById(Guid id)
        {
            return await _friendRepository.GetById(id);
        }

        public async Task<Guid> UpdatePair(Guid idPair, Guid idUser, Guid idFriend)
        {
            return await _friendRepository.Update(idPair, idUser, idFriend);
        }
    }
}
