import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import {
  Search,
  ExternalLink,
  Copy,
  Trash2,
  ChevronLeft,
  ChevronRight,
  SquarePen,
  X,
} from "lucide-react";
import { apiRequest } from "../utils/api";
import Alert from "../components/Alert";

const Links = () => {
  const { accessToken } = useSelector((state) => state.auth);

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [linksData, setLinksData] = useState([]);
  const [loading, setLoading] = useState(false);
  
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingLink, setEditingLink] = useState(null);
  const [editForm, setEditForm] = useState({
    originalUrl: "",
    shortCode: "",
    status: "active"
  });
  const [editLoading, setEditLoading] = useState(false);
  const [editError, setEditError] = useState("");

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deletingLink, setDeletingLink] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const [alert, setAlert] = useState({ show: false, type: "success", message: "" });

  const limit = 10;

     const fetchLinks = async (page) => {
    if (!accessToken) return; 
    setLoading(true);

    try {
      const data = await apiRequest(`/links?page=${page}&limit=${limit}`, {}, accessToken);
      if (data.success) {
        setLinksData(data.data.items || []);
        setTotalPages(data.data.totalPages || data.data.pagination?.pages || 1);
        setTotalItems(data.data.total || data.data.pagination?.total || 0);
      } else {
        setLinksData([]);
        setTotalPages(1);
        setTotalItems(0);
      }
    } catch (err) {
      setLinksData([]);
      setTotalPages(1);
      setTotalItems(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLinks(currentPage);
  }, [currentPage]);

  const handleCopy = (url) => {
    navigator.clipboard.writeText(url);
    setAlert({ show: true, type: "success", message: "Link copied to clipboard!" });
  };

  const handleDeleteClick = (link) => {
    setDeletingLink(link);
    setIsDeleteModalOpen(true);
  };

  const handleCloseDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setDeletingLink(null);
  };

  const handleConfirmDelete = async () => {
    if (!deletingLink) return;
    
    setDeleteLoading(true);

    try {
      const data = await apiRequest(
        `/links/${deletingLink.shortCode}`,
        {
          method: "DELETE",
        },
        accessToken
      );

      if (data.success) {
        setAlert({ show: true, type: "success", message: "Shortlink deleted successfully!" });
        await fetchLinks(currentPage);
        handleCloseDeleteModal();
      } else {
        setAlert({ show: true, type: "error", message: data.message || "Failed to delete shortlink" });
      }
    } catch (err) {
      setAlert({ show: true, type: "error", message: err.message || "An error occurred while deleting" });
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleEditClick = (link) => {
    setEditingLink(link);
    setEditForm({
      originalUrl: link.originalUrl || "",
      shortCode: link.shortCode || "",
      status: link.status || "active"
    });
    setEditError("");
    setIsEditModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsEditModalOpen(false);
    setEditingLink(null);
    setEditForm({
      originalUrl: "",
      shortCode: "",
      status: "active"
    });
    setEditError("");
  };

  const handleEditFormChange = (e) => {
    const { name, value } = e.target;
    setEditForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setEditLoading(true);
    setEditError("");

    const payload = {
      originalURL: editForm.originalUrl,
      shortCode: editForm.shortCode,
      status: editForm.status
    };

    try {
      const data = await apiRequest(
        `/links/${editingLink.shortCode}`,
        {
          method: "PUT",
          body: payload, 
        },
        accessToken
      );

      if (data.success) {
        await fetchLinks(currentPage);
        handleCloseModal();
      } else {
        setEditError(data.message || "Failed to update shortlink");
      }
    } catch (err) {
      setEditError(err.message || "An error occurred while updating");
    } finally {
      setEditLoading(false);
    }
  };

  return (
    <div className="py-8">
      {alert.show && (
        <Alert
          type={alert.type}
          message={alert.message}
          onClose={() => setAlert({ show: false, type: "success", message: "" })}
        />
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <h1 className="text-2xl sm:text-3xl font-semibold text-gray-900">
            Link Management
          </h1>
          <p className="text-sm text-gray-600 mt-1">
            Browse, search, and manage all your shortened links.{" "}
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search links..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm bg-white cursor-pointer"
            >
              <option>All Status</option>
              <option>Active</option>
              <option>Inactive</option>
            </select>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                    Short URL
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                    Destination
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                    Visits
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                    Created
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {loading ? (
                  <tr>
                    <td colSpan={6} className="text-center py-4">
                      Loading...
                    </td>
                  </tr>
                ) : linksData.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center py-4">
                      No links found
                    </td>
                  </tr>
                ) : (
                  linksData.map((link) => (
                    <tr
                      key={link.id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-blue-600 font-medium">
                            {link.shortCode}
                          </span>
                          <button
                            onClick={() =>
                              handleCopy(
                                `http://localhost:8082/${link.shortCode}`
                              )
                            }
                            className="text-gray-400 hover:text-gray-600 transition-colors"
                          >
                            <Copy className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-gray-600 max-w-xs truncate">
                            {link.originalUrl}
                          </span>
                          <a
                            href={link.originalUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-gray-400 hover:text-gray-600 transition-colors"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </a>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm text-gray-900">
                          {link.redirectCount}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm text-gray-600">
                          {new Date(link.createdAt).toLocaleDateString()}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${
                            link.status === "active"
                              ? "bg-green-100 text-green-700"
                              : "bg-gray-100 text-gray-700"
                          }`}
                        >
                          {link.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap flex gap-2">
                        <button
                          onClick={() => handleDeleteClick(link)}
                          className="text-red-600 hover:text-red-700 transition-colors"
                          title="Delete link"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleEditClick(link)}
                          className="text-blue-600 hover:text-blue-700 transition-colors"
                          title="Edit link"
                        >
                          <SquarePen className="w-4 h-4"/>
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
            <div className="text-sm text-gray-600">
              Showing page {currentPage} of {totalPages} ({totalItems} links)
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="p-2 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="text-sm text-gray-600">
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
                disabled={currentPage === totalPages}
                className="p-2 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {isEditModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">
                Edit Shortlink
              </h2>
              <button
                onClick={handleCloseModal}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleEditSubmit} className="px-6 py-4">
              {editError && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-sm text-red-600">{editError}</p>
                </div>
              )}

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Destination URL
                </label>
                <input
                  type="url"
                  name="originalUrl"
                  value={editForm.originalUrl}
                  onChange={handleEditFormChange}
                  placeholder="https://example.com"
                  required
                  disabled={editLoading}
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm disabled:bg-gray-100 disabled:cursor-not-allowed"
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Short Code
                </label>
                <input
                  type="text"
                  name="shortCode"
                  value={editForm.shortCode}
                  onChange={handleEditFormChange}
                  placeholder="my-custom-code"
                  disabled={editLoading}
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm disabled:bg-gray-100 disabled:cursor-not-allowed"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Leave empty to generate a random code
                </p>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status
                </label>
                <select
                  name="status"
                  value={editForm.status}
                  onChange={handleEditFormChange}
                  disabled={editLoading}
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm bg-white cursor-pointer disabled:bg-gray-100 disabled:cursor-not-allowed"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  disabled={editLoading}
                  className="flex-1 px-4 py-2.5 rounded-lg border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={editLoading}
                  className="flex-1 px-4 py-2.5 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {editLoading && (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  )}
                  {editLoading ? "Updating..." : "Update Link"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isDeleteModalOpen && deletingLink && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">
                Delete Shortlink
              </h2>
              <button
                onClick={handleCloseDeleteModal}
                className="text-gray-400 hover:text-gray-600 transition-colors"
                disabled={deleteLoading}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="px-6 py-4">
              <p className="text-gray-600 mb-4">
                Are you sure you want to delete this shortlink? This action cannot be undone.
              </p>
              
              <div className="bg-gray-50 rounded-lg p-4 mb-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-sm font-medium text-gray-700">Short Code:</span>
                  <span className="text-sm text-blue-600 font-medium">{deletingLink.shortCode}</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-sm font-medium text-gray-700">URL:</span>
                  <span className="text-sm text-gray-600 break-all">{deletingLink.originalUrl}</span>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={handleCloseDeleteModal}
                  disabled={deleteLoading}
                  className="flex-1 px-4 py-2.5 rounded-lg border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleConfirmDelete}
                  disabled={deleteLoading}
                  className="flex-1 px-4 py-2.5 rounded-lg bg-red-600 text-white font-medium hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {deleteLoading && (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  )}
                  {deleteLoading ? "Deleting..." : "Delete"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Links;