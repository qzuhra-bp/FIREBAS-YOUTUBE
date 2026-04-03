import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { getCurrentUser, logoutUser } from "../api/mockAuthService";
import { getCourses } from "../api/courseService";
import styles from "./Dashboard.module.css";

const Dashboard = () => {
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
      console.error("Ошибка загрузки курсов:", error);
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
        courseId: course.id,
        courseTitle: course.title,
        courseImage: course.image,
      }))
    );
  }, [courses]);

  const watchedLessons = useMemo(() => {
    return allLessons.filter((lesson) => lesson.watched);
  }, [allLessons]);

  const totalLessons = allLessons.length;
  const completedLessons = watchedLessons.length;

  const overallProgress = totalLessons
    ? Math.round((completedLessons / totalLessons) * 100)
    : 0;

  const recentWatched = useMemo(() => {
    return [...watchedLessons]
      .filter((lesson) => lesson.watchedAt)
      .sort((a, b) => new Date(b.watchedAt) - new Date(a.watchedAt))
      .slice(0, 5);
  }, [watchedLessons]);

  const lastWatchedVideo = recentWatched.length > 0 ? recentWatched[0] : null;

  const upcomingLessons = useMemo(() => {
    return allLessons
      .filter((lesson) => lesson.scheduleAt && new Date(lesson.scheduleAt) > new Date())
      .sort((a, b) => new Date(a.scheduleAt) - new Date(b.scheduleAt))
      .slice(0, 3);
  }, [allLessons]);

  const getCourseProgress = (course) => {
    const lessons = course.lessons || [];
    if (!lessons.length) return 0;

    const watchedCount = lessons.filter((lesson) => lesson.watched).length;
    return Math.round((watchedCount / lessons.length) * 100);
  };

  const formatDateTime = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);

    return date.toLocaleString("ru-RU", {
      day: "numeric",
      month: "long",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatRelativeTime = (dateString) => {
    if (!dateString) return "";
    const now = new Date();
    const past = new Date(dateString);
    const diffMs = now - past;

    const minutes = Math.floor(diffMs / 60000);
    const hours = Math.floor(diffMs / 3600000);
    const days = Math.floor(diffMs / 86400000);

    if (minutes < 1) return "только что";
    if (minutes < 60) return `${minutes} мин назад`;
    if (hours < 24) return `${hours} ч назад`;
    return `${days} дн назад`;
  };

  if (loading) {
    return <div className={styles.loading}>Загрузка...</div>;
  }

  if (!user) return null;

  return (
    <div className={styles.page}>
      <aside className={styles.sidebar}>
        <div className={styles.logoBlock}>
          <div className={styles.logoIcon}>📘</div>
          <div>
            <div className={styles.logoTop}>ОБРАЗОВАНИЕ</div>
            <div className={styles.logoBottom}>ОНЛАЙН</div>
          </div>
        </div>

        <nav className={styles.nav}>
          <button className={`${styles.navItem} ${styles.activeNav}`}>
            <span>🏠</span>
            <span>Главная</span>
          </button>

          <button className={styles.navItem} onClick={() => navigate("/my-courses")}>
            <span>🎓</span>
            <span>Мои курсы</span>
          </button>
          <button className={styles.navItem} onClick={() => navigate("/my-notes")}>
            <span>📝</span>
            <span>Мои заметки</span>
          </button>
        </nav>

        <button className={styles.logoutButton} onClick={handleLogout}>
          Выйти
        </button>
      </aside>

      <main className={styles.main}>
        <header className={styles.topbar}>
          <div className={styles.topbarGlow}></div>
          <div className={styles.topbarRight}>
              <div className={styles.topbarRight}>
       <button
                type="button"
                className={styles.userMini}
                onClick={() => navigate("/profile")}
              >
                👤
              </button>
            </div>
                        <div className={styles.avatar}>
              {user.name ? user.name.charAt(0).toUpperCase() : "U"}
            </div>
          </div>
        </header>

        <section className={styles.content}>
          <h1 className={styles.welcome}>Добро пожаловать, {user.name}!</h1>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Ваши курсы</h2>

            <div className={styles.coursesGrid}>
              {courses.length === 0 && (
                <div className={styles.emptyCard}>Курсы не найдены</div>
              )}

              {courses.map((course) => {
                const progress = getCourseProgress(course);

                return (
                  <div
                    key={course.id}
                    className={styles.courseCard}
                    onClick={() => navigate(`/course/${course.id}`)}
                  >
                    <div
                      className={styles.courseImage}
                      style={{
                        backgroundImage: `linear-gradient(rgba(8,24,63,0.35), rgba(8,24,63,0.35)), url(${course.image})`,
                      }}
                    ></div>

                    <div className={styles.courseOverlay}>
                      <h3 className={styles.courseTitle}>{course.title}</h3>

                      <div className={styles.progressRow}>
                        <div className={styles.progressBar}>
                          <div
                            className={styles.progressFill}
                            style={{ width: `${progress}%` }}
                          ></div>
                        </div>
                        <span className={styles.progressText}>{progress}%</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          <section className={styles.middleGrid}>
            <div className={styles.card}>
              <h3 className={styles.cardTitle}>Мой прогресс</h3>

              <div className={styles.progressBox}>
                <div
                  className={styles.progressCircle}
                  style={{
                    background: `conic-gradient(#2358d4 ${overallProgress * 3.6}deg, #d9e6fb 0deg)`,
                  }}
                >
                  <div className={styles.progressInner}>{overallProgress}%</div>
                </div>

                <div className={styles.progressInfo}>
                  <div className={styles.progressStatus}>Завершено</div>
                  <div className={styles.progressLine}></div>
                  <div className={styles.progressLine}></div>
                  <div className={styles.progressLineSmall}></div>

                  {lastWatchedVideo && (
                    <div className={styles.lastVideo}>
                      <p className={styles.lastVideoLabel}>Последнее видео:</p>
                      <p className={styles.lastVideoTitle}>
                        {lastWatchedVideo.title}
                      </p>
                      <p className={styles.lastVideoCourse}>
                        {lastWatchedVideo.courseTitle}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className={styles.card}>
              <h3 className={styles.cardTitle}>Ближайшие занятия</h3>

              <div className={styles.scheduleList}>
                {upcomingLessons.length === 0 && (
                  <div className={styles.emptyText}>Нет ближайших занятий</div>
                )}

                {upcomingLessons.map((lesson) => (
                  <div key={lesson.id} className={styles.scheduleItem}>
                    <div className={styles.scheduleIcon}>📘</div>
                    <div>
                      <div className={styles.scheduleName}>{lesson.title}</div>
                      <div className={styles.scheduleTime}>
                        {formatDateTime(lesson.scheduleAt)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section className={styles.card}>
            <div className={styles.notificationHeader}>
              <h3 className={styles.cardTitle}>Последние просмотренные видео</h3>
            </div>

            <div className={styles.notificationsList}>
              {recentWatched.length === 0 && (
                <div className={styles.emptyText}>Вы еще не смотрели видео</div>
              )}

              {recentWatched.map((lesson) => (
                <div key={lesson.id} className={styles.notificationItem}>
                  <div className={styles.mailIcon}>▶</div>

                  <div className={styles.notificationContent}>
                    <div className={styles.notificationText}>
                      {lesson.title} — <span>{lesson.courseTitle}</span>
                    </div>
                  </div>

                  <div className={styles.notificationTime}>
                    {formatRelativeTime(lesson.watchedAt)}
                  </div>
                </div>
              ))}
            </div>
          </section>
        </section>
      </main>
    </div>
  );
};

export default Dashboard;