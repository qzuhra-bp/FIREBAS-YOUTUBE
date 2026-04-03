import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { getCurrentUser, logoutUser } from "../api/mockAuthService";
import { getCourses } from "../api/courseService";
import styles from "./MyNotes.module.css";

const NOTES_STORAGE_KEY = "user_notes_data";

const MyNotes = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [courses, setCourses] = useState([]);
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newNote, setNewNote] = useState("");
  const [selectedLesson, setSelectedLesson] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCourse, setFilterCourse] = useState("all");
  const [editingNoteId, setEditingNoteId] = useState(null);
  const [editingContent, setEditingContent] = useState("");

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
      loadNotes();
    } catch (error) {
      console.error("Ошибка загрузки курсов:", error);
      setCourses([]);
    } finally {
      setLoading(false);
    }
  };

  const loadNotes = () => {
    try {
      const savedNotes = localStorage.getItem(NOTES_STORAGE_KEY);
      if (savedNotes) {
        setNotes(JSON.parse(savedNotes));
      }
    } catch (error) {
      console.error("Ошибка загрузки заметок:", error);
    }
  };

  const saveNotes = (updatedNotes) => {
    try {
      localStorage.setItem(NOTES_STORAGE_KEY, JSON.stringify(updatedNotes));
      setNotes(updatedNotes);
    } catch (error) {
      console.error("Ошибка сохранения заметок:", error);
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
      }))
    );
  }, [courses]);

  const handleAddNote = () => {
    if (!newNote.trim() || !selectedLesson) {
      alert("Пожалуйста, выберите урок и напишите заметку");
      return;
    }

    const note = {
      id: Date.now().toString(),
      lessonId: selectedLesson.id,
      lessonTitle: selectedLesson.title,
      courseId: selectedLesson.courseId,
      courseTitle: selectedLesson.courseTitle,
      content: newNote.trim(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const updatedNotes = [note, ...notes];
    saveNotes(updatedNotes);
    setNewNote("");
    setSelectedLesson(null);
  };

  const handleDeleteNote = (noteId) => {
    if (window.confirm("Вы уверены, что хотите удалить эту заметку?")) {
      const updatedNotes = notes.filter((note) => note.id !== noteId);
      saveNotes(updatedNotes);
    }
  };

  const handleEditNote = (noteId) => {
    const note = notes.find((n) => n.id === noteId);
    setEditingNoteId(noteId);
    setEditingContent(note.content);
  };

  const handleSaveEdit = (noteId) => {
    if (!editingContent.trim()) {
      alert("Заметка не может быть пустой");
      return;
    }

    const updatedNotes = notes.map((note) =>
      note.id === noteId
        ? { ...note, content: editingContent.trim(), updatedAt: new Date().toISOString() }
        : note
    );
    saveNotes(updatedNotes);
    setEditingNoteId(null);
    setEditingContent("");
  };

  const handleCancelEdit = () => {
    setEditingNoteId(null);
    setEditingContent("");
  };

  const filteredNotes = useMemo(() => {
    return notes.filter((note) => {
      const matchesSearch =
        note.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
        note.lessonTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
        note.courseTitle.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesCourse = filterCourse === "all" || note.courseId === filterCourse;

      return matchesSearch && matchesCourse;
    });
  }, [notes, searchTerm, filterCourse]);

  const formatDateTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString("ru-RU", {
      day: "numeric",
      month: "short",
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

          <button className={styles.navItem} onClick={() => navigate("/my-courses")}>
            <span>🎓</span>
            <span>Мои курсы</span>
          </button>
          <button className={`${styles.navItem} ${styles.activeNav}`}>
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
          <h1 className={styles.pageTitle}>Мои заметки</h1>

          <div className={styles.mainGrid}>
            {/* Left side - Add new note */}
            <div className={styles.leftSection}>
              <div className={styles.addNoteCard}>
                <h2 className={styles.cardTitle}>Новая заметка</h2>

                <div className={styles.formGroup}>
                  <label className={styles.label}>Выберите урок</label>
                  <select
                    className={styles.select}
                    value={selectedLesson ? selectedLesson.id : ""}
                    onChange={(e) => {
                      const lesson = allLessons.find((l) => l.id === e.target.value);
                      setSelectedLesson(lesson || null);
                    }}
                  >
                    <option value="">-- Выберите урок --</option>
                    {courses.map((course) => (
                      <optgroup key={course.id} label={course.title}>
                        {(course.lessons || []).map((lesson) => (
                          <option key={lesson.id} value={lesson.id}>
                            {lesson.title}
                          </option>
                        ))}
                      </optgroup>
                    ))}
                  </select>
                </div>

                {selectedLesson && (
                  <div className={styles.selectedLesson}>
                    <div className={styles.lessonIcon}>✓</div>
                    <div>
                      <div className={styles.selectedLessonTitle}>
                        {selectedLesson.title}
                      </div>
                      <div className={styles.selectedLessonCourse}>
                        {selectedLesson.courseTitle}
                      </div>
                    </div>
                  </div>
                )}

                <div className={styles.formGroup}>
                  <label className={styles.label}>Текст заметки</label>
                  <textarea
                    className={styles.textarea}
                    placeholder="Напишите вашу заметку о уроке. Например: важные моменты, вопросы, или идеи..."
                    value={newNote}
                    onChange={(e) => setNewNote(e.target.value)}
                    rows="8"
                  ></textarea>
                </div>

                <button className={styles.addButton} onClick={handleAddNote}>
                  Добавить заметку
                </button>
              </div>

              <div className={styles.statsCard}>
                <div className={styles.stat}>
                  <div className={styles.statValue}>{notes.length}</div>
                  <div className={styles.statLabel}>Заметок всего</div>
                </div>
                <div className={styles.stat}>
                  <div className={styles.statValue}>{courses.length}</div>
                  <div className={styles.statLabel}>Курсов</div>
                </div>
              </div>
            </div>

            {/* Right side - Notes list */}
            <div className={styles.rightSection}>
              <div className={styles.filtersCard}>
                <div className={styles.searchBox}>
                  <input
                    type="text"
                    placeholder="Поиск заметок..."
                    className={styles.searchInput}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>

                <div className={styles.filterBox}>
                  <select
                    className={styles.filterSelect}
                    value={filterCourse}
                    onChange={(e) => setFilterCourse(e.target.value)}
                  >
                    <option value="all">Все курсы</option>
                    {courses.map((course) => (
                      <option key={course.id} value={course.id}>
                        {course.title}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {filteredNotes.length === 0 ? (
                <div className={styles.emptyState}>
                  <div className={styles.emptyIcon}>📋</div>
                  <div className={styles.emptyText}>
                    {notes.length === 0
                      ? "Заметок еще нет. Создайте свою первую заметку!"
                      : "Заметки не найдены по вашему поиску"}
                  </div>
                </div>
              ) : (
                <div className={styles.notesList}>
                  {filteredNotes.map((note) => (
                    <div key={note.id} className={styles.noteCard}>
                      <div className={styles.noteHeader}>
                        <div>
                          <div className={styles.noteLessonTitle}>
                            {note.lessonTitle}
                          </div>
                          <div className={styles.noteCourseTitle}>
                            {note.courseTitle}
                          </div>
                        </div>
                        <div className={styles.noteActions}>
                          {editingNoteId !== note.id && (
                            <>
                              <button
                                className={styles.editButton}
                                onClick={() => handleEditNote(note.id)}
                                title="Редактировать"
                              >
                                ✏️
                              </button>
                              <button
                                className={styles.deleteButton}
                                onClick={() => handleDeleteNote(note.id)}
                                title="Удалить"
                              >
                                🗑️
                              </button>
                            </>
                          )}
                        </div>
                      </div>

                      {editingNoteId === note.id ? (
                        <div>
                          <textarea
                            className={styles.editTextarea}
                            value={editingContent}
                            onChange={(e) => setEditingContent(e.target.value)}
                            rows="5"
                          ></textarea>
                          <div className={styles.editActions}>
                            <button
                              className={styles.saveButton}
                              onClick={() => handleSaveEdit(note.id)}
                            >
                              Сохранить
                            </button>
                            <button
                              className={styles.cancelButton}
                              onClick={handleCancelEdit}
                            >
                              Отмена
                            </button>
                          </div>
                        </div>
                      ) : (
                        <>
                          <div className={styles.noteContent}>{note.content}</div>
                          <div className={styles.noteFooter}>
                            {note.updatedAt !== note.createdAt && (
                              <span className={styles.noteDate}>
                                Отредактировано: {formatDateTime(note.updatedAt)}
                              </span>
                            )}
                            {note.updatedAt === note.createdAt && (
                              <span className={styles.noteDate}>
                                Создано: {formatDateTime(note.createdAt)}
                              </span>
                            )}
                          </div>
                        </>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default MyNotes;
