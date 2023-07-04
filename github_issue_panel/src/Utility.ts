import { DocumentNode, gql } from '@apollo/client/core';

export const issuesWithRespositoryQuery = (ownerName: string, repositoryName: string, cursor: string | null): DocumentNode => {
    if (cursor == null) { 
      return gql`
      query { 
        repository(owner: "${ownerName}", name: "${repositoryName}") {
          issues(first: 100, orderBy: { field: CREATED_AT, direction: DESC }) {
            totalCount,
            nodes {
              id,
              state,
              labels(first: 30) {
                totalCount
                nodes {
                  id,
                  name,
                  color
                }
              }
              milestone {
                number
              }
              assignees {
                totalCount
              }
              url,
              author {
                login,
              },
              title
              createdAt,
              updatedAt,
              comments {
                totalCount
              }
            },
            pageInfo {
              hasNextPage,
              hasPreviousPage,
              startCursor,
              endCursor
            }
          }
        }
      }
    `;
  }
  return gql`
  query { 
    repository(owner: "${ownerName}", name: "${repositoryName}") {
      issues(first: 100, after: "${cursor}" ,orderBy: { field: CREATED_AT, direction: DESC }) {
        totalCount,
        nodes {
          id,
          state,
          labels(first: 30) {
            totalCount
            nodes {
              id,
              name,
              color
            }
          }
          milestone {
            number
          }
          assignees {
            totalCount
          }
          url,
          author {
            login,
          },
          title
          createdAt,
          updatedAt,
          comments {
            totalCount
          }
        },
        pageInfo {
          hasNextPage,
          hasPreviousPage,
          startCursor,
          endCursor
        }
      }
    }
  }
  `;
}


export const getFilterdOnState = (data: any, state: string) => {
    if (state === 'all') {
        return data.repository.issues.nodes;
    }
    return data.repository.issues.nodes.filter((node: any) => {
        if (state === 'open' && node.state === 'OPEN') return true;
        else if (state === 'closed' && node.state === 'CLOSED') return true;
        return false;
    });
}

export const getFilteredOnAssignment = (data: any, assignment: string) => {
    if (assignment === 'all') {
        return data;
    }
    return data.filter((node: any) => {
        if (assignment === 'assigned' && node.assignees.totalCount > 0) return true;
        else if (assignment === 'unassigned' && node.assignees.totalCount === 0) return true;
        return false;
    });
}

export const getFilteredOnReply = (data: any, haveReply: string) => {
    if (haveReply === 'all') {
        return data;
    }
    return data.filter((node: any) => {
        if (haveReply === 'reply' && node.comments.totalCount > 0) return true;
        else if (haveReply === 'noReply' && node.comments.totalCount === 0) return true;
        return false;
    });
}

export const getFilteredOnMilestone = (data: any, milestone: number) => {
    if (milestone === -1) {
        return data;
    } else if (milestone === -2) {
        return data.filter((node: any) => {
            if (node.milestone === null) return true;
            return false;
        });
    }
    return data.filter((node: any) => {
        if (node.milestone === null) return false;
        if (node.milestone.number === milestone) return true;
        return false;
    });
}