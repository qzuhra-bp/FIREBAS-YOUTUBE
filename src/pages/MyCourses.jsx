import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { getCurrentUser, logoutUser } from "../api/mockAuthService";
import { getCourses } from "../api/courseService";
import styles from "./MyCourses.module.css";

const MyCourses = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

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

  const getCourseProgress = (course) => {
    const lessons = course.lessons || [];
    if (!lessons.length) return 0;

    const watchedCount = lessons.filter((lesson) => lesson.watched).length;
    return Math.round((watchedCount / lessons.length) * 100);
  };

  const filteredCourses = useMemo(() => {
    return courses.filter((course) =>
      course.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [courses, searchTerm]);

  const allLessons = useMemo(() => {
    return filteredCourses.flatMap((course) =>
      (course.lessons || []).map((lesson) => ({
        ...lesson,
        courseId: course.id,
        courseTitle: course.title,
        courseImage: course.image,
      }))
    );
  }, [filteredCourses]);

  const totalLessons = allLessons.length;

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
          <button className={styles.navItem} onClick={() => navigate("/dashboard")}>
            <span>🏠</span>
            <span>Главная</span>
          </button>

          <button className={`${styles.navItem} ${styles.activeNav}`}>
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
            <button
              type="button"
              className={styles.userMini}
              onClick={() => navigate("/profile")}
            >
              👤
            </button>
            <div className={styles.avatar}>
              {user.name ? user.name.charAt(0).toUpperCase() : "U"}
            </div>
          </div>
        </header>

        <section className={styles.content}>
          <h1 className={styles.pageTitle}>Мои курсы</h1>

          <div className={styles.searchBox}>
            <input
              type="text"
              placeholder="Поиск курса..."
              className={styles.searchInput}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className={styles.statsRow}>
            <div className={styles.stat}>
              <div className={styles.statValue}>{courses.length}</div>
              <div className={styles.statLabel}>Всего курсов</div>
            </div>
            <div className={styles.stat}>
              <div className={styles.statValue}>{totalLessons}</div>
              <div className={styles.statLabel}>Всего уроков</div>
            </div>
          </div>

          {filteredCourses.length === 0 ? (
            <div className={styles.emptyState}>
              <div className={styles.emptyIcon}>📚</div>
              <div className={styles.emptyText}>
                {searchTerm ? "Курсы не найдены" : "Нет доступных курсов"}
              </div>
            </div>
          ) : (
            <>
              <section className={styles.coursesSection}>
                <h2 className={styles.sectionTitle}>Курсы ({filteredCourses.length})</h2>

                <div className={styles.coursesGrid}>
                  {filteredCourses.map((course) => {
                    const progress = getCourseProgress(course);
                    const lessonsCount = course.lessons?.length || 0;

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
                        >
                          <div className={styles.progressBadge}>{progress}%</div>
                        </div>

                        <div className={styles.courseInfo}>
                          <h3 className={styles.courseTitle}>{course.title}</h3>
                          <p className={styles.courseDescription}>
                            {course.description}
                          </p>

                          <div className={styles.courseMeta}>
                            <span className={styles.lessonCount}>
                              {lessonsCount} уроков
                            </span>
                          </div>

                          <div className={styles.progressBar}>
                            <div
                              className={styles.progressFill}
                              style={{ width: `${progress}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </section>

              <section className={styles.lessonsSection}>
                <h2 className={styles.sectionTitle}>Все уроки ({totalLessons})</h2>

                <div className={styles.lessonsList}>
                  {allLessons.length === 0 ? (
                    <div className={styles.emptyText}>
                      В выбранных курсах нет уроков
                    </div>
                  ) : (
                    allLessons.map((lesson) => (
                      <div key={lesson.id} className={styles.lessonItem}>
                        <div className={styles.lessonIcon}>
                          {lesson.watched ? "✓" : "▶"}
                        </div>

                        <div className={styles.lessonContent}>
                          <div className={styles.lessonTitle}>{lesson.title}</div>
                          <div className={styles.lessonCourse}>
                            {lesson.courseTitle}
                          </div>
                        </div>

                        <div className={styles.lessonStatus}>
                          {lesson.watched && (
                            <span className={styles.watchedBadge}>Просмотрено</span>
                          )}
                        </div>

                        <button
                          className={styles.lessonAction}
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/course/${lesson.courseId}`);
                          }}
                        >
                          Открыть
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </section>
            </>
          )}
        </section>
      </main>
    </div>
  );
};

export default MyCourses;
