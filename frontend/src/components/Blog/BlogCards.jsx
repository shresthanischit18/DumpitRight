/* eslint-disable react/prop-types */
import { Button } from "@material-tailwind/react";
import { format } from "date-fns";
import { FaClock, FaUser } from "react-icons/fa";
import { Link, useLocation } from "react-router-dom";

const BlogCards = ({ blog, deleteBlog }) => {
  const { title, coverImg, user, createdAt } = blog;

  const location = useLocation();

  if (user) {
    return (
      <div className="relative ">
        {!location.pathname.startsWith("/blogs") && (
          <div className="absolute right-2 top-2 ">
            <Button color="red" size="sm" onClick={deleteBlog(blog._id)}>
              Delete
            </Button>
          </div>
        )}

        <Link to={`/blogs/${blog._id}`}>
          <div >
            <img
              src={`http://localhost:8000/${coverImg}`}
              className="h-[300px] w-[400px] object-cover rounded-md "
            />
            <h3 className="mt-4 mb-2 font-bold hover:text-green-600 cursor-pointer">
              {title}
            </h3>
            <p className="mb-2 text-gray-600">
              <FaUser className="inline-flex items-center mr-2" />
              {user?.fullName}
            </p>
            <p className="text-sm text-gray-500">
              <FaClock className="inline-flex items-center mr-2" />
              Published:{" "}
              {format(new Date(createdAt), "MMMM dd, yyyy HH:mm:ss a")}
            </p>
          </div>
        </Link>
      </div>
    );
  }
};

export default BlogCards;
