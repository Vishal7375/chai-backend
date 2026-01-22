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
    const { title, description } = req.body
    // TODO: get video, upload to cloudinary, create video

    if (
    [title, description].some((field) => field?.trim() === "")
    ) {
    throw new ApiError(400, "All fields are required");
    }

    const videoLocalPath = req.files?.video;

    if (!videoLocalPath) {
    throw new ApiError(400, "Video file is required");
    }

    let thumbnailImagePath = req.files?.thumbnail;

    if (
    req.files &&
    Array.isArray(req.files.thumbnail) &&
    req.files.thumbnail.length > 0
    ) {
    thumbnailImagePath = req.files.thumbnail[0].path;
    }

    // const allowedVideoTypes = ["video/mp4", "video/avi", "video/mov", "video/mkv"];
    // if (!allowedVideoTypes.includes(videoLocalPath.mimetype)) {
    //     throw new ApiError(400, "Invalid video format");
    // }

    const videoFile = await uploadOnCloudinary(videoLocalPath);

    if (!videoFile) {
        throw new ApiError(400, "Video upload failed");
    }

    const thumbnail = await uploadOnCloudinary(thumbnailImagePath);

    if (!thumbnail) {
    throw new ApiError(400, "Thumbnail upload failed");
    }

    const newVideo = await Video.create({
    title,
    description,
    videoUrl: videoFile.secure_url,
    thumbnailUrl: thumbnail.secure_url || "",
    uploadedBy: req.user._id,
    });
    res
    .status(201)
    .json(new ApiResponse(201, "Video published successfully", newVideo));

    // const user = await User.findById(req.user._id);
    // user.videos.push(newVideo._id);
    // await user.save();
})

const getVideoById = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    //TODO: get video by id

    // if (!videoId) {
    //     throw new ApiError(400, "Video ID is missing");
    // }

    if (!isValidObjectId(videoId)) {
        throw new ApiError(400, "Invalid video ID");
    }

    const video = await Video.findById(videoId);

    if (!video) {
        throw new ApiError(404, "Video not found");
    }

    res
    .status(200).
    json(new ApiResponse(200, "Video fetched successfully", video));
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