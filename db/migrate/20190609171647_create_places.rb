class CreatePlaces < ActiveRecord::Migration[5.2]
  def up
    drop_table :places
    create_table :places do |t|
      t.string :title
      t.text :description
      t.point :coordinates
      t.references :user, index: true, null: false

      t.timestamps
    end
  end
end
