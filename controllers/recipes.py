from flask import Blueprint, request, jsonify, g
from models.recipe import Recipe, RecipeSchema
from lib.secure_route import secure_route
from models.comment import Comment, CommentSchema

api = Blueprint('recipes', __name__)

recipes_schema = RecipeSchema(many=True)
recipe_schema = RecipeSchema()
comment_schema = CommentSchema()

@api.route('/recipes', methods=['GET'])
def index():
    recipes = Recipe.query.all()
    return recipes_schema.jsonify(recipes)

@api.route('/recipes/<int:recipe_id>', methods=['GET'])
def show(recipe_id):
    recipe = Recipe.query.get(recipe_id)
    return recipe_schema.jsonify(recipe)


@api.route('/recipes/<int:recipe_id>/comments', methods=['POST'])
@secure_route
def create(recipe_id):
    comment, errors = comment_schema.load(request.get_json())
    comment.user = g.current_user

    if errors:
        return jsonify(errors), 422
    comment.save()

    return comment_schema.jsonify(comment)
