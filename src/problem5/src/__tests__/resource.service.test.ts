import { resourceService } from "../services/resource.service";
import { resourceRepository } from "../repositories/resource.repository";
import { NotFoundError } from "../errors/AppError";

jest.mock("../repositories/resource.repository");

const mockedRepository = resourceRepository as jest.Mocked<typeof resourceRepository>;

const mockResource = {
  id: "550e8400-e29b-41d4-a716-446655440000",
  name: "Test Resource",
  description: "A test resource",
  categoryId: "550e8400-e29b-41d4-a716-446655440001",
  category: {
    id: "550e8400-e29b-41d4-a716-446655440001",
    name: "Technology",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  tags: [],
  createdAt: new Date(),
  updatedAt: new Date(),
};

describe("resourceService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("findById", () => {
    it("returns resource when found", async () => {
      mockedRepository.findById.mockResolvedValue(mockResource);

      const result = await resourceService.findById(mockResource.id);

      expect(result).toEqual(mockResource);
      expect(mockedRepository.findById).toHaveBeenCalledWith(mockResource.id);
    });

    it("throws NotFoundError when resource does not exist", async () => {
      mockedRepository.findById.mockResolvedValue(null);

      await expect(resourceService.findById("non-existent-id")).rejects.toThrow(NotFoundError);
      await expect(resourceService.findById("non-existent-id")).rejects.toThrow(
        "Resource with id 'non-existent-id' not found"
      );
    });
  });

  describe("delete", () => {
    it("calls repository delete when resource exists", async () => {
      mockedRepository.findById.mockResolvedValue(mockResource);
      mockedRepository.delete.mockResolvedValue(mockResource);

      await resourceService.delete(mockResource.id);

      expect(mockedRepository.delete).toHaveBeenCalledWith(mockResource.id);
    });

    it("throws NotFoundError when resource does not exist", async () => {
      mockedRepository.findById.mockResolvedValue(null);

      await expect(resourceService.delete("non-existent-id")).rejects.toThrow(NotFoundError);
      expect(mockedRepository.delete).not.toHaveBeenCalled();
    });
  });
});
