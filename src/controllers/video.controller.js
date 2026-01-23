import mongoose, {isValidObjectId} from "mongoose"
import {Video} from "../models/video.model.js"
import {User} from "../models/user.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"
import {uploadOnCloudinary} from "../utils/cloudinary.js"


const getAllVideos = asyncHandler(async (req, res) => {
    const { page = 1, limit = 10, query, sortBy, sortType, userId } = req.query
    //TODO: get all videos based on query, sort, pagination
})

const publishAVideo = asyncHandler(async (req, res) => {
    const { title, description } = req.body;
    const userId = req.user?._id;

    // Validate text fields
    if ([title, description].some(field => !field || field.trim() === "")) {
        throw new ApiError(400, "Title and description are required");
    }

    // Validate files existence
    if (!req.files) {
        throw new ApiError(400, "Video file is required");
    }

    // Extract video file
    const videoLocalPath = req.files?.videoFile?.[0]?.path;
    if (!videoLocalPath) {
        throw new ApiError(400, "Video file is required");
    }

    // Extract thumbnail (optional)
    const thumbnailLocalPath =
        req.files?.thumbnail?.[0]?.path || null;

    // Upload video to Cloudinary
    const videoUpload = await uploadOnCloudinary(videoLocalPath);
    if (!videoUpload?.secure_url) {
        throw new ApiError(500, "Video upload failed");
    }

    // Upload thumbnail if exists
    let thumbnailUrl = "";
    if (thumbnailLocalPath) {
        const thumbnailUpload = await uploadOnCloudinary(thumbnailLocalPath);
        if (!thumbnailUpload?.secure_url) {
            throw new ApiError(500, "Thumbnail upload failed");
        }
        thumbnailUrl = thumbnailUpload.secure_url;
    }

    // Create video document
    const createdVideo = await Video.create({
        title,
        description,
        videoFile: videoUpload.secure_url,
        thumbnail: thumbnailUrl,
        duration: videoUpload.duration || 0,
        owner: userId
    });

    if (!createdVideo) {
        throw new ApiError(500, "Failed to create video");
    }

    // Send response
    return res.status(201).json(
        new ApiResponse(
            201,
            createdVideo,
            "Video published successfully"
        )
    );
});


const getVideoById = asyncHandler(async (req, res) => {
    console.log(videoId);

    const { videoId } = req.params.videoId;
    //TODO: get video by id
})

const updateVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    //TODO: update video details like title, description, thumbnail

})

const deleteVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    //TODO: delete video
})

const togglePublishStatus = asyncHandler(async (req, res) => {
    const { videoId } = req.params
})

export {
    getAllVideos,
    publishAVideo,
    getVideoById,
    updateVideo,
    deleteVideo,
    togglePublishStatus
}