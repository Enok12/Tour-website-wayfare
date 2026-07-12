import { tourRequestRepository } from "@/server/repositories/tour-request.repository";
import { userRepository } from "@/server/repositories/user.repository";
import { TourRequestStatus } from "@prisma/client";

export const dashboardService = {
  async getSummary() {
    const [
      totalRequests,
      pending,
      assigned,
      inProgress,
      completed,
      totalMembers,
      availableMembers,
      recentRequests,
      recentlyAssigned,
    ] = await Promise.all([
      tourRequestRepository.countTotal(),
      tourRequestRepository.countByStatus(TourRequestStatus.PENDING),
      tourRequestRepository.countByStatus(TourRequestStatus.ASSIGNED),
      tourRequestRepository.countByStatus(TourRequestStatus.IN_PROGRESS),
      tourRequestRepository.countByStatus(TourRequestStatus.COMPLETED),
      userRepository.countMembers(),
      userRepository.countMembers(true),
      tourRequestRepository.listRecent(5),
      tourRequestRepository.listRecentlyAssigned(5),
    ]);

    return {
      cards: {
        totalRequests,
        pendingRequests: pending,
        assignedTours: assigned,
        activeTours: inProgress,
        completedTours: completed,
        totalMembers,
        availableMembers,
      },
      recentRequests,
      recentlyAssigned,
    };
  },
};
