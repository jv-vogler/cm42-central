import React from 'react';
import classname from 'classnames';
import PropTypes from 'prop-types';
import StoryPopover from '../StoryPopover';
import StoryDescriptionIcon from '../StoryDescriptionIcon';
import CollapsedStoryStateButton from './CollapsedStoryStateButton';
import CollapsedStoryEstimate from './CollapsedStoryEstimate';
import CollapsedStoryPoints from './CollapsedStoryPoints';

import {
  classIconRule,
  iconRule,
  isStoryNotEstimated,
  IsShow,
  labelSplit,
  isRelease,
} from '../../../rules/story';

const StateAction = {
  started: ["finish"],
  finished: ["deliver"],
  delivered: ["accept", "reject"],
  rejected: ["restart"],
  accepted: [],
  unstarted: ["start"]
};


export const StateActions = ({ storyType, estimate, state }) => (
  <div className='Story__actions'>
    {
      isStoryNotEstimated(storyType, estimate)
        ? <CollapsedStoryPoints />
        : StoryActionFor(state).map((stateAction) =>
          <CollapsedStoryStateButton action={stateAction} key={stateAction} />
        )
    }
  </div>
);

const StoryActionFor = (state) => StateAction[state] || StateAction.unstarted;

StateActions.propTypes = {
  storyType: PropTypes.string.isRequired,
  estimate: PropTypes.number,
  state: PropTypes.string.isRequired
};

StateActions.defaultProp = {
  estimate: '-',
};

const StoryIcon = ({ storyType }) => (
  <span className='Story__icon'>
    <i className={`mi md-${classIconRule(storyType)} md-16`}>{iconRule(storyType)}</i>
  </span>
);

StoryIcon.propTypes = {
  storyType: PropTypes.string.isRequired,
};

const StoryLabel = ({ label }) => (
  <a href="#" className="Story__label" title={label}>{label}</a>
);

StoryLabel.propTypes = {
  label: PropTypes.string.isRequired,
};

const StoryLabels = ({ labels }) => {
  if (!labels) {
    return null
  }

  return (
    <span className='Story__labels'>
      {labelSplit(labels).map(label => (
        <StoryLabel key={label} label={label} />
      ))}
    </span>
  );
};

export const StoryTitle = ({ title, ownedByInitials, ownedByName }) => (
  <div className="Story__title">
    {title}
    <abbr
      className="Story__initials"
      title={ownedByName}
    >
      {ownedByInitials}
    </abbr>
  </div>
);

StoryTitle.propTypes = {
  title: PropTypes.string.isRequired,
  ownedByName: PropTypes.string,
  ownedByInitials: PropTypes.string,
};

const StoryInfo = ({ title, labels, ownedByName, ownedByInitials }) => (
  <div className="Story__info">
    <StoryLabels labels={labels} />
    <StoryTitle title={title} ownedByInitials={ownedByInitials} ownedByName={ownedByName} />
  </div>
);

StoryInfo.propTypes = {
  title: PropTypes.string.isRequired,
  labels: PropTypes.string,
};

StoryInfo.defaultProps = {
  labels: '',
};

const classNameStory = (storyType, estimate) => classname(
  'Story',
  {
    'Story--unestimated': isStoryNotEstimated(storyType, estimate),
    'Story--estimated': !isStoryNotEstimated(storyType, estimate),
    'Story--release': isRelease(storyType)
  }
);

const CollapsedStory = ({ story }) => (
  <div className={classNameStory(story.storyType, story.estimate)}>
    <StoryPopover
      description={story.description}
      notes={story.notes}
      createdAt={story.createdAt}
      title={story.title}
      storyType={story.storyType}
      requestedByName={story.requestedByName}
    >
      <div className='Story__icons-block'>
        <StoryIcon storyType={story.storyType} />
        <CollapsedStoryEstimate estimate={story.estimate} />
        <StoryDescriptionIcon description={story.description} />
      </div>
    </StoryPopover>

    <StoryInfo
      title={story.title}
      labels={story.labels}
      ownedByInitials={story.ownedByInitials}
      ownedByName={story.ownedByName}
    />
    <StateActions
      storyType={story.storyType}
      estimate={story.estimate}
      state={story.state}
    />
  </div>
);

CollapsedStory.propTypes = {
  story: PropTypes.object.isRequired
};

export default CollapsedStory;
