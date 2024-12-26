import React, { useState } from 'react';
import style from './ViewFaculty.module.css';
import { useQuery } from '@tanstack/react-query';
import { getUsers } from '../../../api/api';

const TABLE_HEAD = ["Profile", "Name", "Role", "Department", "Action"];

export default function ViewFaculty() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["users"],
    queryFn: getUsers,
  });

  const [searchQuery, setSearchQuery] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Error loading data</div>;
  }

  const TABLE_ROWS = data?.users || [];

  // Handle Search
  const filteredRows = TABLE_ROWS.filter((row) => {
    const fullName = `${row.firstName} ${row.middleName || ""} ${row.lastName}`.toLowerCase();
    return fullName.includes(searchQuery.toLowerCase());
  });

  // Handle Sort
  const sortedRows = [...filteredRows].sort((a, b) => {
    if (!sortConfig.key) return 0; // No sorting applied

    const aValue = sortConfig.key === "name"
      ? `${a.firstName} ${a.middleName || ""} ${a.lastName}`.toLowerCase()
      : sortConfig.key === "department"
      ? a?.department?.stream?.toLowerCase()
      : a[sortConfig.key]?.toLowerCase();

    const bValue = sortConfig.key === "name"
      ? `${b.firstName} ${b.middleName || ""} ${b.lastName}`.toLowerCase()
      : sortConfig.key === "department"
      ? b?.department?.stream?.toLowerCase()
      : b[sortConfig.key]?.toLowerCase();

    if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1;
    if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1;
    return 0;
  });

  // Change Sort Config
  const handleSort = (key) => {
    setSortConfig((prev) => {
      if (prev.key === key) {
        // Toggle direction if the same key is clicked
        return { key, direction: prev.direction === "asc" ? "desc" : "asc" };
      }
      return { key, direction: "asc" }; // Default to ascending
    });
  };

  return (
    <div className={style.container}>
      <div className={style.controls}>
        {/* Search Bar */}
        <input
          type="text"
          placeholder="Search by name"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className={style.searchInput}
        />
      </div>

      <div className={style.table_container}>
        <table>
          <thead>
            <tr>
              {TABLE_HEAD.map((head, index) => (
                <th
                  key={head}
                  onClick={() => handleSort(head.toLowerCase())}
                  className={index !== 4 ? style.sortable : ""}
                >
                  {head} {sortConfig.key === head.toLowerCase() ? (sortConfig.direction === "asc" ? "▲" : "▼") : ""}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sortedRows.length > 0 ? (
              sortedRows.map((body, i) => (
                <tr key={i}>
                  <td>
                    <img src={body.profile} alt="Profile" className={style.imgContainer} />
                  </td>
                  <td>{body.firstName} {body.middleName} {body.lastName}</td>
                  <td>{body.role}</td>
                  <td>{body?.department?.stream}</td>
                  <td>
                    <button className={style.action_btn}>Edit</button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={TABLE_HEAD.length}>No Data</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
