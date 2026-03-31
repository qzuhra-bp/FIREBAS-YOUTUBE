import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getCurrentUser, logoutUser } from "../api/mockAuthService";
import { getCourses } from "../api/courseService";
import styles from "./Profile.module.css";

const Profile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const currentUser = getCurrentUser();

    if (!currentUser) {
      navigate("/login");
      return;
    }

    setUser(currentUser);
    loadData();
  }, [navigate]);

  const loadData = async () => {
    try {
      const data = await getCourses();
      setCourses(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Ошибка загрузки профиля:", error);
      setCourses([]);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await logoutUser();
    navigate("/login");
  };

  const allLessons = useMemo(() => {
    return courses.flatMap((course) =>
      (course.lessons || []).map((lesson) => ({
        ...lesson,
        courseTitle: course.title,
      }))
    );
  }, [courses]);

  const watchedLessons = useMemo(() => {
    return allLessons
      .filter((lesson) => lesson.watched && lesson.watchedAt)
      .sort((a, b) => new Date(b.watchedAt) - new Date(a.watchedAt));
  }, [allLessons]);

  const totalLessons = allLessons.length;
  const watchedCount = watchedLessons.length;
  const progress = totalLessons
    ? Math.round((watchedCount / totalLessons) * 100)
    : 0;

  const lastWatchedVideo =
    watchedLessons.length > 0 ? watchedLessons[0] : null;

  const formatDate = (dateString) => {
    if (!dateString) return "";
    return new Date(dateString).toLocaleString("ru-RU", {
      day: "2-digit",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return <div className={styles.loading}>Загрузка...</div>;
  }

  if (!user) return null;

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <div className={styles.header}>
          <div>
            <p className={styles.smallTitle}>Личный кабинет</p>
            <h1 className={styles.title}>{user.name || "Пользователь"}</h1>
          </div>

          <div className={styles.actions}>
            <button
              type="button"
              className={styles.backButton}
              onClick={() => navigate("/dashboard")}
            >
              Назад
            </button>

            <button
              type="button"
              className={styles.logoutButton}
              onClick={handleLogout}
            >
              Выйти
            </button>
          </div>
        </div>

        <div className={styles.grid}>
          <section className={styles.card}>
            <h2 className={styles.cardTitle}>Данные пользователя</h2>

            <div className={styles.userTop}>
              <div className={styles.avatar}>
                {user.name ? user.name.charAt(0).toUpperCase() : "U"}
              </div>

              <div className={styles.userInfo}>
                <div className={styles.infoRow}>
                  <span className={styles.label}>Имя</span>
                  <span className={styles.value}>
                    {user.name || "Не указано"}
                  </span>
                </div>

                <div className={styles.infoRow}>
                  <span className={styles.label}>E-mail</span>
                  <span className={styles.value}>
                    {user.email || "Не указано"}
                  </span>
                </div>

                <div className={styles.infoRow}>
                  <span className={styles.label}>Телефон</span>
                  <span className={styles.value}>
                    {user.phone || "Не указано"}
                  </span>
                </div>
              </div>
            </div>
          </section>

          <section className={styles.card}>
            <h2 className={styles.cardTitle}>Мой прогресс</h2>

            <div className={styles.progressBlock}>
              <div
                className={styles.progressCircle}
                style={{
                  background: `conic-gradient(#2458d3 ${progress * 3.6}deg, #dbe7fb 0deg)`,
                }}
              >
                <div className={styles.progressInner}>{progress}%</div>
              </div>

              <div className={styles.progressInfo}>
                <div className={styles.infoRow}>
                  <span className={styles.label}>Всего видео</span>
                  <span className={styles.value}>{totalLessons}</span>
                </div>

                <div className={styles.infoRow}>
                  <span className={styles.label}>Просмотрено</span>
                  <span className={styles.value}>{watchedCount}</span>
                </div>

                <div className={styles.infoRow}>
                  <span className={styles.label}>Осталось</span>
                  <span className={styles.value}>
                    {Math.max(totalLessons - watchedCount, 0)}
                  </span>
                </div>
              </div>
            </div>
          </section>

          <section className={styles.card}>
            <h2 className={styles.cardTitle}>Последнее просмотренное видео</h2>

            {lastWatchedVideo ? (
              <div className={styles.lastVideoCard}>
                <h3 className={styles.videoTitle}>{lastWatchedVideo.title}</h3>
                <p className={styles.videoCourse}>
                  {lastWatchedVideo.courseTitle}
                </p>
                <p className={styles.videoDate}>
                  {formatDate(lastWatchedVideo.watchedAt)}
                </p>
              </div>
            ) : (
              <p className={styles.emptyText}>Пока нет просмотренных видео</p>
            )}
          </section>

          <section className={styles.card}>
            <h2 className={styles.cardTitle}>Просмотренные видео</h2>

            {watchedLessons.length === 0 ? (
              <p className={styles.emptyText}>Вы еще не смотрели видео</p>
            ) : (
              <div className={styles.videoList}>
                {watchedLessons.map((lesson) => (
                  <div key={lesson.id} className={styles.videoItem}>
                    <div>
                      <h3 className={styles.videoTitle}>{lesson.title}</h3>
                      <p className={styles.videoCourse}>{lesson.courseTitle}</p>
                    </div>

                    <div className={styles.videoDate}>
                      {formatDate(lesson.watchedAt)}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
};

export default Profile;