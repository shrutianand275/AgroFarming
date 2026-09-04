import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  Bell,
  Check,
  Trash2,
  Info,
  Sprout,
  AlertTriangle,
  CheckCircle
} from "lucide-react";

import Navbar from "../../components/Navbar/Navbar";
import API from "../../services/api";
import "./Notifications.css";

function Notifications() {
  const { i18n } = useTranslation();
  const navigate = useNavigate();

  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const isHindi = i18n.language === "hi";

  useEffect(() => {
    loadNotifications();
  }, []);

  const loadNotifications = async () => {
    try {
      const response = await API.get("/notifications");

      if (response.data.success) {
        setNotifications(response.data.data);
      }
    } catch (err) {
      if (err.response?.status === 401) {
        navigate("/login");
      } else {
        setError(
          isHindi
            ? "सूचनाएं लोड नहीं हो सकीं।"
            : "Unable to load notifications."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (id) => {
    try {
      await API.put(`/notifications/${id}/read`);

      setNotifications((previous) =>
        previous.map((item) =>
          item.id === id
            ? { ...item, read: true }
            : item
        )
      );
    } catch (err) {
      setError(
        isHindi
          ? "सूचना अपडेट नहीं हो सकी।"
          : "Unable to update notification."
      );
    }
  };

  const deleteNotification = async (id) => {
    try {
      await API.delete(`/notifications/${id}`);

      setNotifications((previous) =>
        previous.filter((item) => item.id !== id)
      );
    } catch (err) {
      setError(
        isHindi
          ? "सूचना हटाई नहीं जा सकी।"
          : "Unable to delete notification."
      );
    }
  };

  const clearAll = async () => {
    const confirmed = window.confirm(
      isHindi
        ? "क्या आप सभी सूचनाएं हटाना चाहते हैं?"
        : "Are you sure you want to clear all notifications?"
    );

    if (!confirmed) return;

    try {
      await API.delete("/notifications");
      setNotifications([]);
    } catch (err) {
      setError(
        isHindi
          ? "सूचनाएं साफ नहीं हो सकीं।"
          : "Unable to clear notifications."
      );
    }
  };

  const getIcon = (type) => {
    switch (type) {
      case "success":
        return <CheckCircle size={21} />;

      case "warning":
        return <AlertTriangle size={21} />;

      case "farming":
        return <Sprout size={21} />;

      default:
        return <Info size={21} />;
    }
  };

  const formatDate = (date) => {
    if (!date) return "";

    return new Date(date).toLocaleString(
      isHindi ? "hi-IN" : "en-IN",
      {
        dateStyle: "medium",
        timeStyle: "short"
      }
    );
  };

  const unreadCount = notifications.filter(
    (item) => !item.read
  ).length;

  return (
    <>
      <Navbar />

      <div className="notifications-page">

        {/* ================= HEADER ================= */}

        <div className="notifications-header">

          <div className="notifications-title">

            <div className="notifications-icon">
              <Bell size={27} />
            </div>

            <div>
              <h1>
                {isHindi
                  ? "सूचनाएं"
                  : "Notifications"}
              </h1>

              <p>
                {isHindi
                  ? "अपने AgroFarming अपडेट देखें"
                  : "Stay updated with your AgroFarming activities"}
              </p>
            </div>

          </div>

          {notifications.length > 0 && (
            <button
              className="clear-notifications-btn"
              onClick={clearAll}
            >
              <Trash2 size={16} />

              {isHindi
                ? "सभी हटाएं"
                : "Clear All"}
            </button>
          )}

        </div>


        {/* ================= UNREAD ================= */}

        {unreadCount > 0 && (
          <div className="unread-info">
            <Bell size={16} />

            {isHindi
              ? `${unreadCount} नई सूचना`
              : `${unreadCount} unread notification${
                  unreadCount > 1 ? "s" : ""
                }`}
          </div>
        )}


        {/* ================= ERROR ================= */}

        {error && (
          <div className="notifications-error">
            {error}
          </div>
        )}


        {/* ================= LOADING ================= */}

        {loading && (
          <div className="notifications-empty">
            <Bell size={38} />

            <h3>
              {isHindi
                ? "सूचनाएं लोड हो रही हैं..."
                : "Loading notifications..."}
            </h3>
          </div>
        )}


        {/* ================= EMPTY ================= */}

        {!loading &&
          notifications.length === 0 &&
          !error && (
            <div className="notifications-empty">

              <div className="empty-bell">
                <Bell size={40} />
              </div>

              <h2>
                {isHindi
                  ? "कोई नई सूचना नहीं"
                  : "No Notifications"}
              </h2>

              <p>
                {isHindi
                  ? "आपकी महत्वपूर्ण AgroFarming सूचनाएं यहां दिखाई देंगी।"
                  : "Your important AgroFarming notifications will appear here."}
              </p>

            </div>
          )}


        {/* ================= NOTIFICATIONS ================= */}

        {!loading &&
          notifications.length > 0 && (

            <div className="notifications-list">

              {notifications.map((item) => (

                <div
                  key={item.id}
                  className={`notification-card ${
                    item.read ? "read" : "unread"
                  }`}
                >

                  <div
                    className={`notification-card-icon ${item.type}`}
                  >
                    {getIcon(item.type)}
                  </div>


                  <div className="notification-content">

                    <div className="notification-top">

                      <div>
                        <h3>
                          {item.title}
                        </h3>

                        {!item.read && (
                          <span className="new-badge">
                            {isHindi ? "नई" : "NEW"}
                          </span>
                        )}
                      </div>

                      <button
                        className="delete-notification-btn"
                        onClick={() =>
                          deleteNotification(item.id)
                        }
                        title={
                          isHindi
                            ? "हटाएं"
                            : "Delete"
                        }
                      >
                        <Trash2 size={16} />
                      </button>

                    </div>


                    <p>
                      {item.message}
                    </p>


                    <div className="notification-bottom">

                      <span className="notification-date">
                        {formatDate(item.created_at)}
                      </span>

                      {!item.read && (
                        <button
                          className="mark-read-btn"
                          onClick={() =>
                            markAsRead(item.id)
                          }
                        >
                          <Check size={15} />

                          {isHindi
                            ? "पढ़ा हुआ"
                            : "Mark as read"}
                        </button>
                      )}

                    </div>

                  </div>

                </div>

              ))}

            </div>
          )}

      </div>
    </>
  );
}

export default Notifications;