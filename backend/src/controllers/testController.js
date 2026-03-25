import TestResult from '../models/TestResult.js';
import User from '../models/User.js';

export const submitTestResult = async (req, res) => {
  try {
    const { userId, subject, mcqResults, codingResults } = req.body;

    if (!userId || !subject || !mcqResults || !codingResults) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // Verify user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Calculate MCQ percentage
    const mcqPercentage = Math.round((mcqResults.score / mcqResults.totalQuestions) * 100);

    // Determine if passed (MCQ >= 4/5 and coding score >= 80)
    const mcqPassed = mcqResults.score >= 4;
    const codingPassed = codingResults.codingScore >= 80;
    const overallPassed = mcqPassed && codingPassed;

    // Calculate overall score (60% MCQ + 40% Coding)
    const overallScore = Math.round((mcqPercentage * 0.6) + (codingResults.codingScore * 0.4));

    const testResult = new TestResult({
      userId,
      subject,
      mcqResults: {
        ...mcqResults,
        percentage: mcqPercentage,
      },
      codingResults,
      overallScore,
      passed: overallPassed,
      status: 'pending',
    });

    const savedResult = await testResult.save();

    res.status(201).json({
      message: 'Test result submitted successfully',
      data: savedResult,
    });
  } catch (error) {
    console.error('Error submitting test result:', error);
    res.status(500).json({ message: 'Failed to submit test result', error: error.message });
  }
};

export const getTestResults = async (req, res) => {
  try {
    const { userId } = req.query;

    if (!userId) {
      return res.status(400).json({ message: 'userId is required' });
    }

    const results = await TestResult.find({ userId })
      .populate('userId', 'name email')
      .populate('approvedBy', 'name email')
      .sort({ submittedAt: -1 });

    res.json({
      message: 'Test results retrieved',
      data: results,
    });
  } catch (error) {
    console.error('Error retrieving test results:', error);
    res.status(500).json({ message: 'Failed to retrieve test results', error: error.message });
  }
};

export const getPendingApprovals = async (req, res) => {
  try {
    const results = await TestResult.find({ status: 'pending' })
      .populate('userId', 'name email')
      .sort({ submittedAt: -1 });

    res.json({
      message: 'Pending test approvals retrieved',
      data: results,
    });
  } catch (error) {
    console.error('Error retrieving pending approvals:', error);
    res.status(500).json({ message: 'Failed to retrieve pending approvals', error: error.message });
  }
};

export const approveTestResult = async (req, res) => {
  try {
    const { resultId, adminId } = req.body;

    if (!resultId || !adminId) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const result = await TestResult.findByIdAndUpdate(
      resultId,
      {
        status: 'approved',
        approvedBy: adminId,
      },
      { new: true }
    ).populate('userId', 'name email');

    res.json({
      message: 'Test result approved',
      data: result,
    });
  } catch (error) {
    console.error('Error approving test result:', error);
    res.status(500).json({ message: 'Failed to approve test result', error: error.message });
  }
};

export const rejectTestResult = async (req, res) => {
  try {
    const { resultId, adminId, notes } = req.body;

    if (!resultId || !adminId) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const result = await TestResult.findByIdAndUpdate(
      resultId,
      {
        status: 'rejected',
        approvedBy: adminId,
        adminNotes: notes || '',
      },
      { new: true }
    ).populate('userId', 'name email');

    res.json({
      message: 'Test result rejected',
      data: result,
    });
  } catch (error) {
    console.error('Error rejecting test result:', error);
    res.status(500).json({ message: 'Failed to reject test result', error: error.message });
  }
};
