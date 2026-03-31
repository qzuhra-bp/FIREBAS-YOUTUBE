import React, { useState } from "react";
import { markLessonAsWatched } from "../api/courseService";

const VideoPlayer = ({ lesson, onWatched }) => {
  const [saving, setSaving] = useState(false);

  const getYoutubeEmbedUrl = (url) => {
    if (!url) return "";

    if (url.includes("youtube.com/embed/")) {
      return url;
    }

    if (url.includes("youtube.com/watch?v=")) {
      const videoId = url.split("v=")[1]?.split("&")[0];
      return `https://www.youtube.com/embed/${videoId}`;
    }

    if (url.includes("youtu.be/")) {
      const videoId = url.split("youtu.be/")[1]?.split("?")[0];
      return `https://www.youtube.com/embed/${videoId}`;
    }

    if (url.includes("youtube.com/shorts/")) {
      const videoId = url.split("shorts/")[1]?.split("?")[0];
      return `https://www.youtube.com/embed/${videoId}`;
    }

    return "";
  };

  if (!lesson) {
    return <div>Выберите урок</div>;
  }

  const embedUrl = getYoutubeEmbedUrl(lesson.videoUrl);

  const handleWatched = async () => {
    try {
      setSaving(true);
      await markLessonAsWatched(lesson.id);

      if (onWatched) {
        onWatched();
      }
    } catch (error) {
      console.error("Ошибка отметки просмотра:", error);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div
      style={{
        width: "100%",
        background: "#ffffff",
        borderRadius: "18px",
        overflow: "hidden",
        boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
      }}
    >
      <div
        style={{
          padding: "18px 22px",
          borderBottom: "1px solid #e2e8f0",
          fontSize: "24px",
          fontWeight: "700",
          color: "#1e3a8a",
        }}
      >
        {lesson.title}
      </div>

      <div
        style={{
          position: "relative",
          width: "100%",
          paddingBottom: "56.25%",
          background: "#000",
        }}
      >
        <iframe
          src={embedUrl}
          title={lesson.title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            border: "none",
          }}
        />
      </div>

      <div style={{ padding: "16px 22px" }}>
        <button
          onClick={handleWatched}
          disabled={saving}
          style={{
            width: "100%",
            height: "48px",
            border: "none",
            borderRadius: "12px",
            background: "#2563eb",
            color: "#fff",
            fontSize: "16px",
            fontWeight: "700",
            cursor: "pointer",
          }}
        >
          {saving ? "Сохранение..." : "Отметить как просмотренное"}
        </button>
      </div>
    </div>
  );
};

export default VideoPlayer;