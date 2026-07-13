import { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getPracticeById } from '../data/practices';
import { getAllPracticesPoolIds, sortPlacements } from '../services/practiceInstances';
import { getAllListPlacementTag } from '../services/practicePlacementTags';
import { PracticeManageCard } from '../components/practice/PracticeManageCard';
import { LongPressContextMenu } from '../components/ui/LongPressContextMenu';
import { Button } from '../components/ui/Button';
import { usePracticeListManagement } from '../hooks/usePracticeListManagement';
import { useAppData } from '../context/AppDataContext';
import { setSetupReentry } from '../services/setupReentry';
import styles from './EditPracticesPage.module.css';

function matchesSearch(name: string, query: string): boolean {
  return name.toLowerCase().includes(query.trim().toLowerCase());
}

export default function EditPracticesPage() {
  const navigate = useNavigate();
  const { lists } = useAppData();
  const { menu, pressedId, openMenu, closeMenu, contextMenuOptions } =
    usePracticeListManagement();
  const [savedFlash, setSavedFlash] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const allIds = useMemo(() => getAllPracticesPoolIds(lists), [lists]);
  const sortedDaily = useMemo(() => sortPlacements(lists.daily), [lists.daily]);
  const sortedOther = useMemo(() => sortPlacements(lists.other), [lists.other]);
  const sortedAll = useMemo(
    () =>
      [...allIds].sort((a, b) => {
        const pa = getPracticeById(a);
        const pb = getPracticeById(b);
        return (pa?.canonicalOrder ?? 9999) - (pb?.canonicalOrder ?? 9999);
      }),
    [allIds]
  );

  const filteredDaily = useMemo(() => {
    if (!searchQuery.trim()) return sortedDaily;
    return sortedDaily.filter((placement) => {
      const practice = getPracticeById(placement.practiceId);
      return practice ? matchesSearch(practice.name, searchQuery) : false;
    });
  }, [sortedDaily, searchQuery]);

  const filteredOther = useMemo(() => {
    if (!searchQuery.trim()) return sortedOther;
    return sortedOther.filter((placement) => {
      const practice = getPracticeById(placement.practiceId);
      return practice ? matchesSearch(practice.name, searchQuery) : false;
    });
  }, [sortedOther, searchQuery]);

  const filteredAll = useMemo(() => {
    if (!searchQuery.trim()) return sortedAll;
    return sortedAll.filter((id) => {
      const practice = getPracticeById(id);
      return practice ? matchesSearch(practice.name, searchQuery) : false;
    });
  }, [sortedAll, searchQuery]);

  const handleSave = () => {
    setSavedFlash(true);
    window.setTimeout(() => {
      navigate('/');
    }, 600);
  };

  const handleSetupReentry = () => {
    setSetupReentry(true);
    navigate('/setup/daily');
  };

  const renderPlacementSection = (
    title: string,
    placements: typeof sortedDaily,
    context: 'daily' | 'other'
  ) => {
    if (placements.length === 0) return null;
    return (
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>{title}</h2>
        <div className={styles.groupedList}>
          {placements.map((placement) => {
            const practice = getPracticeById(placement.practiceId);
            if (!practice) return null;
            return (
              <PracticeManageCard
                key={placement.instanceId}
                practiceId={placement.practiceId}
                name={practice.name}
                compact
                pressed={pressedId === placement.instanceId}
                onLongPress={({ x, y }) =>
                  openMenu(placement.practiceId, context, x, y, placement.instanceId)
                }
              />
            );
          })}
        </div>
      </section>
    );
  };

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <Link to="/" className={styles.back} aria-label="Back">
          <svg width="24" height="24" viewBox="0 0 24 24" aria-hidden>
            <path
              d="M15 18l-6-6 6-6"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </Link>
        <h1 className={styles.title}>Edit practices</h1>
      </header>

      <div className={styles.searchRow}>
        <input
          type="search"
          className={styles.searchInput}
          placeholder="Search practices"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          aria-label="Search practices"
        />
      </div>

      <div className={styles.scrollBody}>
        {renderPlacementSection('My daily practices', filteredDaily, 'daily')}
        {renderPlacementSection('My other practices', filteredOther, 'other')}

        {(filteredAll.length > 0 || !searchQuery.trim()) && (
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>All practices</h2>
            <div className={styles.groupedList}>
              {filteredAll.map((id) => {
                const practice = getPracticeById(id);
                if (!practice) return null;
                return (
                  <PracticeManageCard
                    key={id}
                    practiceId={id}
                    name={practice.name}
                    compact
                    placementTag={getAllListPlacementTag(lists, id)}
                    pressed={pressedId === id}
                    onLongPress={({ x, y }) => openMenu(id, 'all', x, y)}
                  />
                );
              })}
            </div>
          </section>
        )}

        <div className={styles.setupReentry}>
          <Button variant="subordinate" onClick={handleSetupReentry}>
            Edit setup
          </Button>
        </div>
      </div>

      <footer className={styles.footer}>
        {savedFlash && <p className={styles.savedMessage}>Saved</p>}
        <Button onClick={handleSave}>Save</Button>
      </footer>

      <LongPressContextMenu
        open={menu !== null}
        x={menu?.x ?? 0}
        y={menu?.y ?? 0}
        options={contextMenuOptions}
        onDismiss={closeMenu}
      />
    </div>
  );
}
