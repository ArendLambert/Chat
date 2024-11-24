using Chat.Core.Models;

namespace Chat.DataAccess.Repositories
{
    public interface IFriendRepository
    {
        Task<Guid> Create(FriendPair pair);
        Task<Guid> Delete(Guid id);
        Task<List<FriendPair>> Get();
        Task<FriendPair> GetById(Guid id);
        Task<Guid> Update(Guid id, Guid idUser, Guid idFriend);
    }
}