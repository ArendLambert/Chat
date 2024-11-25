using Microsoft.AspNetCore.SignalR;

namespace ChatBackend.Hubs
{
    public class VideoHub : Hub
    {
        private readonly ILogger<VideoHub> _logger;

        public VideoHub(ILogger<VideoHub> logger)
        {
            _logger = logger;
        }

        public override async Task OnConnectedAsync()
        {
            _logger.LogInformation($"Client connected: {Context.ConnectionId}");
            await base.OnConnectedAsync();
        }

        public override async Task OnDisconnectedAsync(Exception? exception)
        {
            _logger.LogInformation($"Client disconnected: {Context.ConnectionId}");
            await base.OnDisconnectedAsync(exception);
        }

        public string GetConnectionId()
        {
            return Context.ConnectionId;
        }

        public async Task SendOffer(string targetUserId, object offer)
        {
            _logger.LogInformation($"Sending offer from {Context.ConnectionId} to {targetUserId}");
            await Clients.Client(targetUserId).SendAsync("ReceiveOffer", Context.ConnectionId, offer);
        }

        public async Task SendAnswer(string targetUserId, object answer)
        {
            _logger.LogInformation($"Sending answer from {Context.ConnectionId} to {targetUserId}");
            await Clients.Client(targetUserId).SendAsync("ReceiveAnswer", answer);
        }

        public async Task SendCandidate(string targetUserId, object candidate)
        {
            _logger.LogInformation($"Sending ICE candidate from {Context.ConnectionId} to {targetUserId}");
            await Clients.Client(targetUserId).SendAsync("ReceiveCandidate", candidate);
        }
    }
}
