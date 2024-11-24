using Chat.Application.Services;
using Chat.Contracts;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Chat.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class FriendsPairController : ControllerBase
    {
        private readonly IFriendPairService _friendPairService;
        public FriendsPairController(IFriendPairService friendPairService)
        {
            _friendPairService = friendPairService;
        }
        [HttpGet]
        [Authorize]
        public async Task<ActionResult<List<PairsResponse>>> GetPairs()
        {
            var pairs = await _friendPairService.GetAllPairs();

            var pairResponse = pairs.Select(x => new PairsResponse(x.Id, x.UserId, x.FriendId));
            return Ok(pairResponse);
        }

        [HttpPost]
        [Authorize]
        public async Task<ActionResult<Guid>> CreatePair([FromBody] PairRequest request)
        {
            var pair = Chat.Core.Models.FriendPair.Create(Guid.NewGuid(),
                                                             request.userId,
                                                             request.friendId);
            var pairId = await _friendPairService.CreatePair(pair);
            return Ok(pairId);
        }

        [HttpPut("{id:guid}")]
        [Authorize]
        public async Task<ActionResult<Guid>> UpdatePair(Guid id, [FromBody] PairRequest request)
        {
            var pairId = await _friendPairService.UpdatePair(id, request.userId, request.friendId);
            return Ok(pairId);
        }

        [HttpDelete("{id:guid}")]
        [Authorize]
        public async Task<ActionResult<Guid>> DeletePair(Guid id)
        {
            var pairId = await _friendPairService.DeletePair(id);
            return Ok(pairId);
        }

        [HttpGet("by-id")]
        public async Task<ActionResult<PairsResponse>> GetById(Guid idPair)
        {
            var pair = await _friendPairService.GetById(idPair);
            var pairResponse = new PairsResponse(Guid.Empty, Guid.Empty, Guid.Empty);
            if (pair != null)
            {
                pairResponse = new PairsResponse(pair.Id, pair.UserId, pair.FriendId);
            }
            return Ok(pairResponse);
        }
    }
}
