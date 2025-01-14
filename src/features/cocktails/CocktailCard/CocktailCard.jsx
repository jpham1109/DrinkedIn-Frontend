import React, { useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { Error } from '../../../components/Error'
import { handleLike } from '../../../util/cocktail/AddCocktailLike'
import {
	addUsersLike,
	deleteUsersLike,
	selectCurrentUser,
} from '../../auth/authSlice'
import {
	useAddNewLikeMutation,
	useDeleteLikeMutation,
} from '../../likes/likesSlice'
import { selectUserById } from '../../users/usersSlice'
import { selectCocktailById } from '../cocktailsSlice'
import styles from './CocktailCard.module.css'
import cocktailDefault from '../../../images/cocktail-default.jpeg'

const CocktailCard = ({ id, openPanel }) => {
	//reading the cocktail data from the store
	const cocktail = useSelector((state) => selectCocktailById(state, id))
	// current logged in user, to distinguish from the cocktail creator
	const currentUser = useSelector(selectCurrentUser)
	const dispatch = useDispatch()

	const {
		name,
		ingredients,
		likes_count: likesCount,
		bartender_id,
		photo,
	} = cocktail ?? {}

	const cocktailCreator =
		useSelector((state) => selectUserById(state, bartender_id)) ?? undefined

	// Mutation hook to add new like and remove like to the cocktail
	const [addNewLike] = useAddNewLikeMutation()
	const [deleteLike] = useDeleteLikeMutation()

	// memoized value to check if the current user has already liked the cocktail
	const initialHasLiked = useMemo(
		() =>
			currentUser?.likes?.find((like) => like.liked_cocktail_id === id) ||
			false,
		[currentUser, id]
	)

	// state to set if the current user has already liked the cocktail
	const [hasLiked, setHasLiked] = useState(initialHasLiked)

	const ingredientItems = Array.isArray(ingredients)
		? ingredients?.map((i) => <li key={i}>{i}</li>)
		: null

	return cocktail ? (
		<div className={styles.card}>
			<div className={styles.image}>
				<Link to={`/cocktails/${id}`}>
					<img
						className={styles.image__img}
						src={photo ?? cocktailDefault}
						alt={name}
						loading="lazy"
					/>
				</Link>
			</div>
			<div className={styles.info}>
				<Link to={`/cocktails/${id}`}>
					<h3>{name}</h3>
				</Link>

				{ingredientItems ? <span>{ingredientItems}</span> : null}

				<button
					onClick={() =>
						handleLike({
							addNewLike,
							addUsersLike,
							currentUser,
							deleteLike,
							deleteUsersLike,
							dispatch,
							hasLiked,
							id,
							setHasLiked,
							openPanel,
						})
					}
				>
					{hasLiked ? '💜' : '🤍'} {likesCount}
				</button>

				<h5>
					{cocktailCreator?.full_name
						? cocktailCreator?.full_name
						: cocktailCreator?.username}
				</h5>
			</div>
			<Link to={`/cocktails/${id}`} className={styles.viewMore}>
				View More
			</Link>
		</div>
	) : (
		<Error> Cocktail not found</Error>
	)
}

export default React.memo(CocktailCard)
