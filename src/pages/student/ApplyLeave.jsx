import { useState } from 'react';
import Button from '../../components/common/Button';
import { QUESTION_BANK } from '../../data/questionBank';

const ApplyLeave = ({ onSubmit, onBack }) => {
  const [formData, setFormData] = useState({
    reason: '',
    startDate: '',
    endDate: '',
    subject: 'Mathematics',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.reason && formData.startDate && formData.endDate) {
      onSubmit?.(formData);
    }
  };

  const subjects = Object.keys(QUESTION_BANK);

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-4 mb-8">
        <button
          onClick={onBack}
          className="text-blue-600 hover:text-blue-700 font-semibold"
        >
          ← Back
        </button>
        <h1 className="text-3xl font-bold text-gray-900">Apply for Leave</h1>
      </div>

      <div className="bg-white rounded-lg shadow-md p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Reason */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              Reason for Leave
            </label>
            <textarea
              name="reason"
              value={formData.reason}
              onChange={handleChange}
              placeholder="Describe the reason for your leave..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
              rows="4"
            />
          </div>

          {/* Date Range */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Start Date
              </label>
              <input
                type="date"
                name="startDate"
                value={formData.startDate}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                End Date
              </label>
              <input
                type="date"
                name="endDate"
                value={formData.endDate}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          {/* Subject Selection */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              Subject for Test
            </label>
            <select
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
            >
              {subjects.map((subject) => (
                <option key={subject} value={subject}>
                  {subject}
                </option>
              ))}
            </select>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-800">
              <strong>Note:</strong> After submitting this form, you'll need to complete a test (MCQ + Coding) to validate your leave request.
            </p>
          </div>

          {/* Buttons */}
          <div className="flex gap-4">
            <Button onClick={onBack} variant="secondary">
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              Proceed to Test
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ApplyLeave;
